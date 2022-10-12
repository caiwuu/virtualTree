<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-10-11 11:01:00
-->
<template>
  <div class="container">
    <div :id="uuid" class="tree-wraper" :style="style">
      <zg-tree
        :style="innerStyle"
        v-bind="config"
        :sourceData="rangeData"
        @collapseChange="collapseChange"
      ></zg-tree>
    </div>
    <scroll-bar :height="config.height"></scroll-bar>
  </div>
</template>

<script>
  import zgTree from '@/components/ZgTree/ZgTree.vue'
  import VirtualListEngine from '@/core/VirtualEngine'
  import scrollBar from '../scrollBar/scrollBar'
  import uuid from '@/utils/uuid'
  export default {
    name: 'VirtualTree',
    props: {
      // 静态全量数据模式
      sourceData: {
        type: Array,
        default: () => [],
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
        console.log(item, index)
      },
      getList(notice, pageOpt) {
        console.log(pageOpt)
        this.allList = this.allList.concat(this.allList.slice(0, 15))
        notice && notice(this.allList.length)
      },
    },
    created() {
      this.virtuaListEngine = new VirtualListEngine({
        container: `#${this.uuid}`,
        pageSize: 50,
        rowHeight: this.config.itemHeight,
        pageNo: 1,
      })
      this.virtuaListEngine.on('pageNoChange', (pageNo, pageSize) => {
        console.log('请求数据', pageNo, pageSize)
      })
      this.virtuaListEngine.on('rangeChange', (start, end) => {
        console.log('数据区间改变', start, end)
        this.start = start
        this.end = end
        console.log(this.rangeData)
      })
    },
    mounted() {
      this.virtuaListEngine.run()
    },
    computed: {
      style() {
        return `height:${this.config.height}px;overflow: auto;width:${this.config.width - 6}px;`
      },
      innerStyle() {
        return `transform: translateY(${this.start * this.config.itemHeight}px);`
      },
      rangeData() {
        return this.sourceData.slice(this.start, this.end + 1)
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
