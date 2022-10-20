<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-10-20 19:13:46
-->
<template>
  <div class="container">
    <div :id="uuid" class="tree-wraper" :style="style">
      <tree
        :default-checked-keys="defaultCheckedKeys"
        ref="tree"
        v-slot="{ ...scope }"
        :style="innerStyle"
        :height="height"
        :width="height"
        :row-height="rowHeight"
        :level-indent="levelIndent"
        :show-checkbox="showCheckbox"
        :checkbox-bg="checkboxBg"
        checkOnClickNode
        :data="rangeData"
        @collapseChange="collapseChange"
        @selectChange="selectChange"
      >
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

export default {
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
      return this.$refs.tree.getSelect()
    },
    selectChange(list) {
      this.$emit('selectChange', list)
    },
    collapseChange(item, index) {
      const { level, collapsed } = item
      const activeIdx = index + this.start
      // 折叠行为
      if (collapsed) {
        item.collapsed = true
        for (let idx = activeIdx + 1; idx < this.activeData.length; idx++) {
          const ele = this.activeData[idx]
          if (level >= ele.level) {
            this.activeData.splice(activeIdx + 1, idx - activeIdx - 1)
            return
          }
        }
        this.activeData.splice(activeIdx + 1, this.activeData.length - activeIdx - 1)
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
            this.activeData.splice(activeIdx + 1, 0, ...res)
            return
          }
          if (lastQueueEle.level >= ele.level) {
            queue = queue.slice(0, ele.level)
            lastQueueEle = queue[queue.length - 1]
          }
          if (!lastQueueEle.collapsed) {
            res.push(ele)
            if (lastQueueEle.level < ele.level) queue.push(ele)
          }
        }
        this.activeData.splice(activeIdx + 1, 0, ...res)
      }
    },
  },
  created() {
    if (this.isStatic) {
      this.allData = this.data
      this.activeData = [...this.allData]
    }
    this.virtuaListEngine = new VirtualListEngine({
      container: `#${this.uuid}`,
      rowHeight: this.rowHeight,
      sectionSize: this.sectionSize,
      isStatic: this.isStatic,
      dataSize: this.activeData.length,
    })
    this.virtuaListEngine.on('pageChange', ({ pageNo, pageSize }) => {
      console.log('请求数据', pageNo, pageSize)
    })
    this.virtuaListEngine.on('rangeChange', ({ start, end }) => {
      console.log('数据区间改变', start, end)
      this.start = start
      this.end = end
    })
  },
  mounted() {
    this.virtuaListEngine.run((ve) => {
      this.$refs.scrollBar.connect(ve)
    })
  },
  watch: {
    dataSize(nv) {
      this.virtuaListEngine && this.virtuaListEngine.emit('dataSize', nv)
    },
  },
  computed: {
    dataSize() {
      return this.activeData.length
    },
    isStatic() {
      return typeof data !== 'function'
    },
    style() {
      return `height:${this.height}px;overflow: auto;width:${this.width - 6}px;`
    },
    innerStyle() {
      return `transform: translateY(${this.start * this.rowHeight}px);`
    },
    rangeData() {
      return this.activeData.slice(this.start, this.end + 1)
    },
  },
  components: {
    Tree,
    scrollBar,
  },
}
</script>
<style scoped>
.container {
  display: flex;
}

.tree-wraper {
  position: relative;
}

.tree-wraper::-webkit-scrollbar {
  display: none;
}
</style>