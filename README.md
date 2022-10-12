<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-10-12 16:14:52
-->
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

模拟滚动条：滚动事件还是用原生，但是原生UI表现的太真实了，非全量的时候数据一页一页从服务端来的，所以滚动条会非连续的长度变化，我们需要伪装一个滚动条，模拟滚动进度。