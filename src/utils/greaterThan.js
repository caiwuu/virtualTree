// position 比较运算 left > right ?
export default function greaterThan(left, right) {
  const leftArr = left.split('-')
  const rightArr = right.split('-')
  for (let index = 0; index < leftArr.length; index++) {
    if (rightArr[index] === undefined) {
      return true
    }
    if (+leftArr[index] > +rightArr[index]) {
      return true
    }
    if (+leftArr[index] < +rightArr[index]) {
      return false
    }
  }
  return false
}
