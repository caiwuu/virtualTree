/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-01 10:58:14
 */
// console.time('qq')
// const iterable = (function* () {
//   let a = 0
//   while (1) {
//     yield a++
//   }
// })()

// const buffer = new ArrayBuffer(1000000 * 4)
// const z = new Uint32Array(buffer)
// for (let index = 0; index < 1000000; index++) {
//   z[index] = iterable.next().value
// }
// console.timeEnd('qq')

let res = []
console.time('qq')
for (let index = 0; index < 1000000; index++) {
  res.push(index)
}
console.timeEnd('qq')
// res = res.slice(0, 450000).concat([1, 2, 3, 4, 5555, 6666], res.slice(450000))

// function topAdd($0) {
//   $0.scrollTop++
//   setTimeout(() => {
//     topAdd($0)
//   }, 10)
// }
