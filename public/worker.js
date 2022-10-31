/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-31 15:20:51
 */
self.onmessage = function (e) {
  //监听主线程发过来的消息
  console.log(e)
  self.postMessage(111) // 将信息发送到主线程上
}
