<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-11-07 17:40:49
-->
<template>
  <div class="container">
    <div :id="uuid" class="v-tree" :style="style">
      <v-tree-items :ve="virtuaListEngine" :default-checked-keys="defaultCheckedKeys" ref="tree" v-slot="{ ...scope }" :style="innerStyle"
        :height="height" :width="height" :row-height="rowHeight" :level-indent="levelIndent"
        :show-checkbox="showCheckbox" :checkbox-bg="checkboxBg" check-on-click-node :check-strictly="false" :data="rangeData"
        @collapse-change="collapseChange" @select-change="selectChange" @node-click="nodeClick">
        <slot v-bind="scope"></slot>
      </v-tree-items>
    </div>
    <v-scroll-bar ref="scrollBar" :height="height"></v-scroll-bar>
  </div>
</template>

<script>
import VTreeItems from './VTreeItems.vue'
import VirtualEngine from './VirtualEngine'
import VScrollBar from './VScrollBar.vue'
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
  data () {
    return {
      dataSize: 1,
      rangeData: [],
      allData: [], // 总数据池
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
    getSelect () {
      // const ids = this.$refs.tree.getSelect()
      // console.time('getSelect')
      // const selectedItem = ids.map(idx => this.allData.find(ele => ele.id === idx))
      // console.timeEnd('getSelect');
      return this.$refs.tree.getSelect()
    },
    selectChange (rows) {
      this.$emit('select-change', rows)
    },
    nodeClick (row) {
      this.$emit('node-click', row)
    },
    collapseChange (item, index) {
      const { level, collapsed } = item
      const activeIdx = index + this.start
      // 折叠行为
      if (!collapsed) {
        item.collapsed = true
        for (let idx = activeIdx + 1; idx < activeIndexs.length; idx++) {
          const ele = this.allData[activeIndexs[idx]]
          if (level >= ele.level) {
            activeIndexs = activeIndexs.slice(0, activeIdx + 1).concat(activeIndexs.slice(idx))
            this.setRangeData()
            return
          }
        }
        // case：尾部折叠
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
          const ele = this.allData[idx]
          let lastQueueEle = queue[queue.length - 1]
          if (level >= ele.level) {
            activeIndexs = activeIndexs.slice(0, activeIdx + 1).concat(res, activeIndexs.slice(activeIdx + 1))
            this.setRangeData()
            return
          }
          if (lastQueueEle.level >= ele.level) {
            const idx = queue.findIndex(i => i.level === ele.level)
            queue = queue.slice(0, idx)
            lastQueueEle = queue[queue.length - 1]
          }
          if (!lastQueueEle.collapsed) {
            res.push(idx)
            if (lastQueueEle.level < ele.level) queue.push(ele)
          }
        }
        activeIndexs = activeIndexs.slice(0, activeIdx + 1).concat(res, activeIndexs.slice(activeIdx + 1))
        this.setRangeData()
      }
    },
    setRangeData () {
      console.log("setRangeData");
      this.dataSize = activeIndexs.length
      this.rangeData = activeIndexs.slice(this.start, this.end + 1).map(i => this.allData[i])
    }
  },
  created () {
    activeIndexs = []
    console.log("created");
    // 静态数据
    if (this.isStatic) {
      this.allData = this.data
      for (let index = 0; index < this.allData.length; index++) {
        activeIndexs.push(index)
      }
    }

    this.virtuaListEngine = new VirtualEngine({
      container: `#${this.uuid}`,
      rowHeight: this.rowHeight,
      sectionSize: this.sectionSize,
      isStatic: this.isStatic,
      dataSize: activeIndexs.length,
    })
    this.virtuaListEngine.on('pageChange', ({ pageNo, pageSize }) => {
      console.log('请求数据', pageNo, pageSize)
      // 分页数据
      const partialData = this.data(pageNo, pageSize)
      this.allData.push(...partialData)
      console.log(partialData);
    })
    this.virtuaListEngine.on('rangeChange', ({ start, end }) => {
      console.log('数据区间改变', start, end)
      this.start = start
      this.end = end
    })
  },
  beforeUnmount () {
    this.virtuaListEngine.destroy()
  },
  mounted () {
    this.virtuaListEngine.run((ve) => {
      this.setRangeData()
      this.$refs.scrollBar.connect(ve)
    })
  },
  watch: {
    dataSize (nv) {
      this.virtuaListEngine && this.virtuaListEngine.emit('dataSize', nv)
    },
    start () {
      this.rangeData = activeIndexs.slice(this.start, this.end + 1).map(i => this.allData[i])
    }
  },
  computed: {
    isStatic () {
      return typeof this.data !== 'function'
    },
    style () {
      return `height:${this.height}px;overflow: auto;width:${this.width}px;`
    },
    innerStyle () {
      return `transform: translateY(${this.start * this.rowHeight}px);`
    },
  },
  components: {
    VTreeItems,
    VScrollBar,
  },
}
</script>
<style scoped>
.container {
  border: 1px solid #e5e5e5;
  display: flex;
}

.v-tree {
  position: relative;
}

.v-tree::-webkit-scrollbar {
  display: none;
}
</style>
