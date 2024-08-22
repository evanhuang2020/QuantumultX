function GetCookie() {
  try {
    debug($request.headers);
    const headers = ObjectKeys2LowerCase($request.headers);
    $.newToken = headers['rest_api_token'];

    if (/user\/token/.test($request.url) && !new RegExp($.newToken).test($.token)) {
      // 新增用户数据
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
    let response = await someAPIRequest(token); // 调用任务 API 检查 Token

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

// 模拟 API 请求函数，您需要根据实际场景替换成真实的 API 请求
function someAPIRequest(token) {
  return new Promise((resolve) => {
    // 模拟 API 响应
    let success = Math.random() > 0.3; // 假设 30% 几率 Token 失效
    if (success) {
      resolve({ code: 200, message: 'Token 有效' });
    } else {
      resolve({ code: 401, message: 'Token 已失效' });
    }
  });
}

// 示例：在新增用户数据之后，检查所有账户的有效性并移除失效账户
(async function() {
  // 新增 Token 的时候获取 Token
  GetCookie();

  // 清理失效的 Token
  await cleanInvalidTokens();

  // 打印剩余的有效 Token
  console.log('最终有效 Token 列表:', $.tokenArr);
})();
