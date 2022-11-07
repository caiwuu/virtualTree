<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-11-07 17:19:36
-->
<template>
  <div class="container">
    <div :id="uuid" class="tree-wraper" :style="style">
      <tree :default-checked-keys="defaultCheckedKeys" ref="tree" v-slot="{ ...scope }" :style="innerStyle"
        :height="height" :width="height" :row-height="rowHeight" :level-indent="levelIndent"
        :show-checkbox="showCheckbox" :checkbox-bg="checkboxBg" checkOnClickNode :data="rangeData"
        @collapse-change="collapseChange" @select-change="selectChange" @node-click="nodeClick">
        <slot v-bind="scope"></slot>
      </tree>
    </div>
    <scroll-bar ref="scrollBar" :height="height"></scroll-bar>
  </div>
</template>

<script>
import Tree from '@/components/tree/Tree.vue'
import VirtualListEngine from '@/core/VirtualEngine'
import scrollBar from '../scrollBar/scrollBar'
import uuid from '@/utils/uuid'
import search from '@/utils/search'
let activeIndexs = []
export default {
  install: function (Vue) {
    Vue.component(this.name, this);
  },
  name: 'VirtualTree',
  props: {
    // 静态全量数据模式
    data: {
      type: [Array, Function],
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    rowHeight: Number,
    levelIndent: Number,
    showCheckbox: Boolean,
    height: Number,
    width: Number,
    sectionSize: Number,
    checkboxBg: String,
  },
  data() {
    return {
      rangeData: [],
      allData: [], // 总数据池
      activeData: [], // 活数据池
      uuid: uuid(),
      start: 0,
      end: 0,
      pageOpt: {
        pageSize: 15,
        pageNo: 1,
      },
      virtuaListEngine: null,
    }
  },
  methods: {
    getSelect() {
      const ids = this.$refs.tree.getSelect()
      console.time('getSelect')
      const selectedItem = ids.map(idx => this.allData.find(ele => ele.id === idx))
      console.timeEnd('getSelect');
      return selectedItem
    },
    selectChange(rows) {
      this.$emit('select-change', rows)
    },
    nodeClick(row) {
      this.$emit('node-click', row)
    },
    collapseChange(item, index) {
      const { level, collapsed } = item
      const activeIdx = index + this.start
      // 折叠行为
      if (collapsed) {
        item.collapsed = true
        // for (let idx = activeIdx + 1; idx < this.activeData.length; idx++) {
        for (let idx = activeIdx + 1; idx < activeIndexs.length; idx++) {
          // const ele = this.activeData[idx] // 方案 1
          // const ele = this.allData[this.activeData[idx]] // 方案2
          const ele = this.allData[activeIndexs[idx]] // 方案3
          if (level >= ele.level) {
            // this.activeData = this.activeData.slice(0, activeIdx + 1).concat(this.activeData.slice(idx))
            console.time('折叠')
            activeIndexs = activeIndexs.slice(0, activeIdx + 1).concat(activeIndexs.slice(idx))
            console.timeEnd('折叠');
            this.setRangeData()
            return
          }
        }
        // this.activeData = this.activeData.slice(0, activeIdx + 1)
        activeIndexs = activeIndexs.slice(0, activeIdx + 1)
        this.setRangeData()
      } else {
        // 展开行为
        // 在总数据池中的位置
        item.collapsed = false
        const i = search(this.allData, item)
        let queue = [item]
        const res = []
        for (let idx = i + 1; idx < this.allData.length; idx++) {
          // debugger
          const ele = this.allData[idx]
          let lastQueueEle = queue[queue.length - 1]
          if (level >= ele.level) {
            console.time('展开')
            // this.activeData = this.activeData.slice(0, activeIdx + 1).concat(res, this.activeData.slice(activeIdx + 1))
            activeIndexs = activeIndexs.slice(0, activeIdx + 1).concat(res, activeIndexs.slice(activeIdx + 1))
            console.timeEnd('展开');
            this.setRangeData()
            return
          }
          if (lastQueueEle.level >= ele.level) {
            const idx = queue.findIndex(i => i.level === ele.level)
            queue = queue.slice(0, idx)
            lastQueueEle = queue[queue.length - 1]
          }
          if (!lastQueueEle.collapsed) {
            // res.push(ele) // 方案 1
            res.push(idx) // 方案 2
            if (lastQueueEle.level < ele.level) queue.push(ele)
          }
        }
        // this.activeData = this.activeData.slice(0, activeIdx + 1).concat(res, this.activeData.slice(activeIdx + 1))
        activeIndexs = activeIndexs.slice(0, activeIdx + 1).concat(res, activeIndexs.slice(activeIdx + 1))
        this.setRangeData()
      }
    },
    setRangeData() {
      console.log("setRangeData");
      this.rangeData = activeIndexs.slice(this.start, this.end + 1).map(i => this.allData[i])
    }
  },
  created() {
    activeIndexs = []
    console.log("created");
    // 静态数据
    if (this.isStatic) {
      this.allData = this.data
      // 方案 1
      // this.activeData = [...this.allData]
      // 方案 2
      for (let index = 0; index < this.allData.length; index++) {
        // this.activeData.push(index)
        activeIndexs.push(index)
      }
    }

    this.virtuaListEngine = new VirtualListEngine({
      container: `#${this.uuid}`,
      rowHeight: this.rowHeight,
      sectionSize: this.sectionSize,
      isStatic: this.isStatic,
      // dataSize: this.activeData.length,
      dataSize: activeIndexs.length,
    })
    this.virtuaListEngine.on('pageChange', ({ pageNo, pageSize }) => {
      console.log('请求数据', pageNo, pageSize)
      // 分页数据
      const partialData = this.data(pageNo, pageSize)
      this.allData.push(...partialData)
      this.activeData.push(...partialData)
      console.log(partialData);
    })
    this.virtuaListEngine.on('rangeChange', ({ start, end }) => {
      console.log('数据区间改变', start, end)
      this.start = start
      this.end = end
    })
  },
  beforeUnmount() {
    this.virtuaListEngine.destroy()
  },
  mounted() {
    this.virtuaListEngine.run((ve) => {
      this.setRangeData()
      this.$refs.scrollBar.connect(ve)
    })
  },
  watch: {
    dataSize(nv) {
      this.virtuaListEngine && this.virtuaListEngine.emit('dataSize', nv)
    },
    start() {
      this.rangeData = activeIndexs.slice(this.start, this.end + 1).map(i => this.allData[i])
    }
  },
  computed: {
    dataSize() {
      // return this.activeData.length
      return activeIndexs.length
    },
    isStatic() {
      return typeof this.data !== 'function'
    },
    style() {
      return `height:${this.height}px;overflow: auto;width:${this.width}px;`
    },
    innerStyle() {
      return `transform: translateY(${this.start * this.rowHeight}px);`
    },
    // rangeData() {
    // 方案 1
    // return this.activeData.slice(this.start, this.end + 1)
    // 方案 2
    // return this.activeData.slice(this.start, this.end + 1).map(i => this.allData[i])
    // return activeIndexs.slice(this.start, this.end + 1).map(i => this.allData[i])
    // },
  },
  components: {
    Tree,
    scrollBar,
  },
}
</script>
<style scoped>
.container {
  border: 1px solid #e5e5e5;
  display: flex;
}

.tree-wraper {
  position: relative;
}

.tree-wraper::-webkit-scrollbar {
  display: none;
}
</style>
