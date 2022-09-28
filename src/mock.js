/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-28 10:59:30
 */
import Mock from 'mockjs'
const data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|10-30': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1,
      name: '11',
      pid: 10,
      'level|0-1': 0,
      'collapsed|1': false,
      'isLeaf|1': true,
      'data|1': {},
    },
  ],
})
export { data }
