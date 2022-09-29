/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-29 16:59:44
 */
import Mock from 'mockjs'
const data = []
function genItems(startId, pid, count, level, parent) {
  if (level === 4) return []
  const res = Mock.mock({
    [`list|1-${count}`]: [
      {
        'id|+1': startId,
        pid: pid,
        level: level,
        'collapsed|1': false,
        'isLeaf|1': true,
        'data|1': {},
      },
    ],
  }).list
  parent.childCount = res.length
  let index = res.length - 1
  for (index; index >= 0; index--) {
    const element = res[index]
    element.name = pid === 0 ? element.id : parent.name + '-' + index
    if (!element.collapsed) {
      const result = genItems(startId + res.length, element.id, count, element.level + 1, element)
      res.splice(index + 1, 0, ...result)
    }
  }
  return res
}
const res = genItems(1, 0, 10, 0, {})
data.push(...res)
export { data }
