<!--
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-18 15:24:50
-->
<template>
  <div class="demo-container">
    <virtual-tree v-slot="{row}" :sourceData="data">
      {{row.name}}
    </virtual-tree>
  </div>
</template>

<script>
import VirtualTree from '@/components/TreeWraper/index.vue'
import { data } from '@/mock'
// import { data } from '@/utils/data.js'
export default {
  name: 'tree-demo',
  components: {
    VirtualTree,
  },
  data() {
    return {
      data: data,
      config: {
        itemHeight: 80,
        levelDistance: 20,
        showCheckbox: true,
        height: 400,
        width: 800,
      }
    }
  },
}
</script>
<style>
.demo-container {
  background: #eee;
  width: 800px;
  margin: 100px auto;
}
</style>
