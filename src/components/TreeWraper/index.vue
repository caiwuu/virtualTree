<template>
  <div id="demo-tree" class="tree-wraper" :style="style">
    <zg-tree
      :style="innerStyle"
      v-bind="config"
      :sourceData="rangeData"
      @collapseChange="collapseChange"
    ></zg-tree>
  </div>
</template>

<script>
  import zgTree from '@/components/ZgTree/ZgTree.vue'
  import VirtualListEngine from '@/core/VirtualEngine'
  export default {
    name: 'VirtualTree',
    props: {
      // 全量数据模式
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
        }),
      },
    },
    data() {
      return {
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
        container: '#demo-tree',
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
        return `height:${this.config.height}px;overflow: auto;`
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
    },
  }
</script>
