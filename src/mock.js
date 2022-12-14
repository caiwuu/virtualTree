/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-31 14:24:47
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
    name: '1-1',
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
    name: '1-1-1',
    pid: 1,
    position: '1-2-3',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 4,
    isLeaf: true,
    level: 3,
    name: '1-1-1-1',
    pid: 1,
    position: '1-2-3-4',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 5,
    isLeaf: false,
    level: 2,
    name: '1-1-2',
    pid: 1,
    position: '1-2-5',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 6,
    isLeaf: true,
    level: 3,
    name: '1-1-2-1',
    pid: 1,
    position: '1-2-5-6',
  },
  {
    childCount: 2,
    collapsed: false,
    data: {},
    id: 7,
    isLeaf: true,
    level: 1,
    name: '1-2',
    pid: 1,
    position: '1-7',
  },
]
const mockData = []
// 随机生成 递归
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

export function genTreeData(l1 = 1, l2 = 10, l3 = 100) {
  let res = []
  let id = 1
  let temp1, temp2, temp3
  for (let index1 = 0; index1 < l1; index1++) {
    temp1 = Mock.mock({
      [`list|1`]: [
        {
          'id|+1': id,
          pid: 0,
          level: 0,
          isLeaf: false,
          collapsed: false,
          name: `${index1 + 1}`,
          position: `${id}`,
        },
      ],
    }).list
    res.push(temp1)
    id++
    for (let index2 = 0; index2 < l2; index2++) {
      temp2 = Mock.mock({
        [`list|1`]: [
          {
            'id|+1': id,
            pid: temp1.id,
            level: 1,
            isLeaf: false,
            collapsed: false,
            name: `${temp1.name}-${index2 + 1}`,
            position: `${temp1.position}-${id}`,
          },
        ],
      }).list
      res.push(temp2)
      id++
      for (let index3 = 0; index3 < l3; index3++) {
        temp3 = Mock.mock({
          [`list|1`]: [
            {
              'id|+1': id,
              pid: temp2.id,
              level: 2,
              isLeaf: true,
              collapsed: false,
              name: `${temp2.name}-${index3 + 1}`,
              position: `${temp2.position}-${id}`,
            },
          ],
        }).list
        res.push(temp3)
        id++
      }
    }
  }
  return res
}

// const res = genItems(1 /*起始id*/, 0 /*父id*/, 10 /*子集最大数量*/, 0 /*级别*/, {} /*父级*/)
// const res = genTreeData()
// const res = staticData
// const data = res
// console.log(data)
// export { data }
