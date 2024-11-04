/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-31 14:24:47
 */
import Mock from 'mockjs'

export function genTreeData (l1 = 1, l2 = 10, l3 = 100) {
  let res = []
  let id = 0
  let temp1, temp2, temp3
  for (let index1 = 0; index1 < l1; index1++) {
    temp1 = Mock.mock({
      [`list|1`]: [
        {
          'id|+1': id,
          pid: -1,
          level: 0,
          isLeaf: false,
          collapsed: false,
          name: `${index1 + 1}`,
          position: `${index1}`,
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
            position: `${temp1.position}-${index2}`,
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
              position: `${temp2.position}-${index3}`,
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
