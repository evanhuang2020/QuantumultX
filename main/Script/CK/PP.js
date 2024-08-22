// 清除变量
$prefs.clearValueForKey('PP_TOKEN');

// 检查是否清除成功
let token = $prefs.valueForKey('PP_TOKEN');
if (!token) {
  console.log("PP_TOKEN 已成功清除");
} else {
  console.log("PP_TOKEN 仍然存在");
}

$done();