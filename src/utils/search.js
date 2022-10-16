import greaterThan from './greaterThan'
// findindex 效率太低，这里采用二分查找查找元素在原始数据中的位置
export default function search(nums, target) {
  let low = 0,
    high = nums.length - 1
  while (low <= high) {
    const mid = Math.floor((high - low) / 2) + low
    const num = nums[mid]
    if (num.id === target.id) {
      return mid
    } else if (greaterThan(num.position, target.position)) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  return -1
}
