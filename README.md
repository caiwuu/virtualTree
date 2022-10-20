<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-10-20 16:40:39
-->
# RUN DEMO
```bash
    npm i
    npm start
```
# 组件文档
## props

- config <Object> 配置
    -  color: 复选框背景颜色；默认 '',
    -  itemHeight: 每一项的高度；默认 36
    -  levelDistance:每一项上下间距；默认 20
    -  showCheckbox:是否展示复选框；默认 false
    -  height: 组件高度；默认 400,
    -  width: 组件宽度；默认 800,
- data <Array> 展示数据 
- defaultCheckedKeys <Array> 默认勾选项的key

## events

- selectChange 当复选框被点击的时候触发 返回选中元素列表

# 设计文档
## 数据结构
```javascript
 mockData = [
     {
         id:11, 
         pid:10, // 父级id
         level:0, // 层级
         collapsed:true, // 是否折叠
         isLeaf:true, // 是否叶子节点
         position:'0', // id链 x-x-x-x-x
         childCount:'0', // 子集数量
         data:{},
     },
 ]
```
### 三层优化

- 渲染层:固定DOM数量，渲染无压力

    浏览器列表dom数量超过1000会有明显的卡顿,本组件能控制固定数量的dom,顾不存在渲染性能问题。

- 数据处理层面:扁平的数据结构,有序的position,二分查找定位数据，百万数据无压力

    除了渲染压力，百万级数据的计算也是一大性能瓶颈。把树状的数据拍平极大的简化了计算逻辑,并且每个元素的position字段是有序的,这使得元素查找可以使用二分查找来替代原生的数组查找方法,查找性能数量级提升。

- 传输层面:对于大数据传输采用独有的协议

    百万级数据除了渲染和计算，和接口交互的数据传输也是一大性能点，如一个父节点有10万个字节的，用户全选再去除一个,如何把勾选的99999条数据给到服务端？直接给99999条数据肯定是不行的,此时需要一种特有的轻量的数据协议来描述用户的行为,如：`{protocol:'xxx',select:id,exclude:'id1,id2'}`

### 原理图

四段缓存法，为什么最小是四段，因为三段无法保证前后各有一段缓存区，渲染慢画面会有拼接感觉；四段能完美保证数据在可视区外拼接，用户无感；每段的大小应该大于等于一屏的大小。

![image-20221012170037027](https://cdn.jsdelivr.net/gh/caiwuu/image/image-20221012170037027.png)

```js
const forwardCriticalPoint = Math.ceil((this.start + this.end) / 2) // 指针前进临界点
const backCriticalPoint = forwardCriticalPoint - this.oneClientRowSize // 指针后退临界点
if (e.target.scrollTop > forwardCriticalPoint * this.rowHeight) {
    this.start += this.oneClientRowSize
    this.end += this.oneClientRowSize
    this.rangeChange()
}
if (e.target.scrollTop < backCriticalPoint * this.rowHeight && this.start > 0) {
    this.start -= this.oneClientRowSize
    this.end -= this.oneClientRowSize
    this.rangeChange()
}
if (this.end + this.oneClientRowSize > this.pageSize * this.pageNo) {
    // 需要增加数据
    this.pageNo++
    this.eventHandle['pageNoChange'](this.pageNo, this.pageSize)
}
```

### TODO
交互细节优化;UI优化;超大数据结构设计(转化和解析算法)