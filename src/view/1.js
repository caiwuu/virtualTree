console.time('qq')
const iterable = (function* () {
  let a = 0
  while (1) {
    yield a++
  }
})()

const buffer = new ArrayBuffer(1000000 * 4)
const z = new Uint32Array(buffer)
for (let index = 0; index < 1000000; index++) {
  z[index] = iterable.next().value
}
console.timeEnd('qq')
