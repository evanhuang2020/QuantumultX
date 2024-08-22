// 获取签到数据
function GetCookie() {
  try {
    console.log("Headers:", $request.headers); // 添加调试信息
    const headers = ObjectKeys2LowerCase($request.headers);
    $.newToken = headers['rest_api_token'];
    
    if (/user\/token/.test($request.url) && !new RegExp($.newToken).test($.token)) {
      $.tokenArr.push($.newToken);
      console.log(`开始新增用户数据 ${$.newToken}`);
      $.setdata($.toStr($.tokenArr), 'pp_token');
      $.msg($.name, ``, `Token 获取成功。🎉`);
    }
  } catch (e) {
    console.log("❌ autoLogin 数据获取失败");
    console.log(e);
  }
}

// 模拟检查 Token 是否有效的函数（可以根据实际 API 返回的内容调整）
async function checkTokenValidity(token) {
  try {
    console.log(`正在检查 Token: ${token}`); // 调试信息
    let response = await someAPIRequest(token); // 调用任务 API 检查 Token
    console.log(`API 响应:`, response); // 调试信息

    if (response.code === 401 || response.message.includes('Token 已失效')) {
      return false; // Token 已失效
    } else {
      return true; // Token 有效
    }
  } catch (error) {
    console.error(`检查 Token 有效性时出错：`, error);
    return false;
  }
}

// 处理所有 Token 的有效性并移除失效 Token
async function cleanInvalidTokens() {
  console.log("开始清理失效的 Token..."); // 调试信息
  for (let i = $.tokenArr.length - 1; i >= 0; i--) {
    const token = $.tokenArr[i];
    const isValid = await checkTokenValidity(token);

    if (!isValid) {
      console.log(`Token ${token} 已失效，移除该用户。`);
      $.tokenArr.splice(i, 1); // 从数组中移除失效 Token
    }
  }

  // 更新 Token 存储
  $.setdata($.toStr($.tokenArr), 'pp_token');
  console.log('Token 清理完毕，剩余有效 Token:', $.tokenArr);
}

// 模拟 API 请求函数，增加超时机制
function someAPIRequest(token) {
  return new Promise((resolve, reject) => {
    // 设置超时机制，5秒内如果没有响应，则中断请求
    const timeout = setTimeout(() => {
      reject(new Error('请求超时'));
    }, 5000);

    // 模拟 API 响应
    let success = Math.random() > 0.3; // 假设 30% 几率 Token 失效
    clearTimeout(timeout); // 清除超时计时器
    if (success) {
      resolve({ code: 200, message: 'Token 有效' });
    } else {
      resolve({ code: 401, message: 'Token 已失效' });
    }
  });
}

// 示例：在新增用户数据之后，检查所有账户的有效性并移除失效账户
(async function() {
  try {
    console.log("开始执行脚本..."); // 调试信息

    // 新增 Token 的时候获取 Token
    GetCookie();

    // 清理失效的 Token
    await cleanInvalidTokens();

    // 打印剩余的有效 Token
    console.log('最终有效 Token 列表:', $.tokenArr);
  } catch (e) {
    console.error("脚本执行时发生错误：", e); // 错误处理
  }
})();
