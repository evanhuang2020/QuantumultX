let tokens = ['token1', 'token2', 'token3']; // 存储所有账户的 Token

// 模拟请求 API 并检测 Token 是否失效
async function requestAPI(token, index) {
    try {
        let response = await someAPIRequest(token); // 调用任务 API
        if (response.code === 401 || response.message.includes('Token 已失效')) { // 假设 401 是 Token 失效的错误码
            console.log(`账户 ${index} 的 Token 已失效，移除该账户。`);
            tokens.splice(index, 1); // 移除失效 Token
        } else {
            console.log(`账户 ${index} 操作成功。`);
        }
    } catch (error) {
        console.error(`账户 ${index} 的请求失败：`, error);
    }
}

// 遍历每个账户并进行任务操作
async function processAccounts() {
    for (let i = tokens.length - 1; i >= 0; i--) { // 倒序遍历，避免删除元素导致索引问题
        await requestAPI(tokens[i], i);
    }
}

// 模拟 API 请求函数
function someAPIRequest(token) {
    return new Promise((resolve, reject) => {
        // 模拟服务器返回的结果
        let success = Math.random() > 0.3; // 假设 30% 几率 Token 失效
        if (success) {
            resolve({ code: 200, message: '操作成功' });
        } else {
            resolve({ code: 401, message: 'Token 已失效' }); // 模拟 Token 失效
        }
    });
}

// 运行处理账户的逻辑
processAccounts().then(() => {
    console.log('所有账户处理完毕');
    console.log('剩余有效的账户 Token:', tokens);
});
