<!--
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-18 13:45:26
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
