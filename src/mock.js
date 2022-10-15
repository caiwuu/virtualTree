/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-13 17:01:50
 */
import Mock from 'mockjs'
const data = []
function genItems(startId, pid, count, level, parent) {
  let res
  if (level === 4) {
    res = []
  } else {
    res = Mock.mock({
      [`list|1-${count}`]: [
        {
          'id|+1': startId,
          pid: pid,
          level: level,
          collapsed: function () {
            return this.isLeaf
          },
          'isLeaf|1': true,
          'data|1': {},
        },
      ],
    }).list
  }
  let index = res.length - 1
  parent.childCount = res.length
  for (index; index >= 0; index--) {
    const element = res[index]
    element.name = pid === 0 ? element.id + '' : parent.name + '-' + index
    element.position = pid === 0 ? element.id + '' : parent.position + '-' + element.id
    if (!element.isLeaf) {
      const result = genItems(startId + res.length, element.id, count, element.level + 1, element)
      res.splice(index + 1, 0, ...result)
    } else {
      element.childCount = 0
    }
  }
  return res
}
const res = genItems(1, 0, 10, 0, {})
data.push(...res)
export { data }
