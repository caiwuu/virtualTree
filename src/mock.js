/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-19 16:51:33
 */
import Mock from 'mockjs'
const staticData = [
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 1,
    isLeaf: false,
    level: 0,
    name: '1',
    pid: 0,
    position: '1',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 2,
    isLeaf: false,
    level: 1,
    name: '1-0',
    pid: 1,
    position: '1-2',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 3,
    isLeaf: false,
    level: 2,
    name: '1-0-0',
    pid: 1,
    position: '1-2-3',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 4,
    isLeaf: false,
    level: 3,
    name: '1-0-0-0',
    pid: 1,
    position: '1-2-3-4',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 5,
    isLeaf: false,
    level: 1,
    name: '1-1',
    pid: 1,
    position: '1-5',
  },
]
const mockData = []
function genItems(startId, pid, count, level, parent) {
  let res
  if (level === 4) {
    res = []
    parent.isLeaf = true
  } else {
    res = Mock.mock({
      [`list|1-${count}`]: [
        {
          'id|+1': startId,
          pid: pid,
          level: level,
          'isLeaf|1': true,
          collapsed: function () {
            return this.isLeaf
          },
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
const res = genItems(1 /*起始id*/, 0 /*父id*/, 5 /*子集最大数量*/, 0 /*级别*/, {} /*父级*/)
mockData.push(...res)
// const data = staticData
const data = mockData
console.log(data)
export { data }
