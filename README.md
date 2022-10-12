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

![image-20221012170037027](https://cdn.jsdelivr.net/gh/caiwuu/image/image-20221012170037027.png)