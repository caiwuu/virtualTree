<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-10-14 17:36:17
-->
<template>
  <div class="container">
    <div :id="uuid" class="tree-wraper" :style="style">
      <zg-tree
        :style="innerStyle"
        v-bind="config"
        checkOnClickNode
        :sourceData="rangeData"
        @collapseChange="collapseChange"
      >
      </zg-tree>
    </div>
    <scroll-bar ref="scrollBar" :height="config.height"></scroll-bar>
  </div>
</template>

<script>
  import zgTree from '@/components/ZgTree/ZgTree.vue'
  import VirtualListEngine from '@/core/VirtualEngine'
  import scrollBar from '../scrollBar/scrollBar'
  import uuid from '@/utils/uuid'
  import search from '@/utils/search'

  export default {
    name: 'VirtualTree',
    props: {
      // 静态全量数据模式
      sourceData: {
        type: [Array, Function],
      },
      config: {
        type: Object,
        default: () => ({
          itemHeight: 80,
          levelDistance: 20,
          showCheckbox: true,
          height: 400,
          width: 800,
        }),
      },
    },
    data() {
      return {
        allData: [],
        activeData: [],
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
      collapseChange(item, index) {
        const { level, collapsed } = item
        const activeIdx = index + this.start
        // 折叠行为
        if (collapsed) {
          for (let idx = activeIdx + 1; idx < this.activeData.length; idx++) {
            const ele = this.activeData[idx]
            if (ele.level === level) {
              this.activeData.splice(activeIdx + 1, idx - activeIdx - 1)
              return
            }
          }
          this.activeData.splice(activeIdx + 1, this.activeData.length - activeIdx - 1)
        } else {
          // 展开行为
          const i = search(this.allData, item)
          // const nextIdx = index + 1
          // const res = []
          // for (let idx = i + 1; idx < this.allData; idx++) {
          //     const ele = this.allData[idx];
          // }
          console.log(i)
        }
      },
    },
    created() {
      if (this.isStatic) {
        this.activeData = this.allData = this.sourceData
      }
      this.virtuaListEngine = new VirtualListEngine({
        container: `#${this.uuid}`,
        rowHeight: this.config.itemHeight,
        sectionSize: this.config.sectionSize,
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
        console.log(this.rangeData)
      })
    },
    mounted() {
      this.virtuaListEngine.run((vt) => {
        this.$refs.scrollBar.connect(vt)
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
        return typeof sourceData !== 'function'
      },
      style() {
        return `height:${this.config.height}px;overflow: auto;width:${this.config.width - 6}px;`
      },
      innerStyle() {
        return `transform: translateY(${this.start * this.config.itemHeight}px);`
      },
      rangeData() {
        return this.activeData.slice(this.start, this.end + 1)
      },
    },
    components: {
      zgTree,
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
