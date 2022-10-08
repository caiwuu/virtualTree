<!--
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-29 16:59:18
-->
<template>
    <div class="demo-container">
        <virtual-tree :sourceData="data"></virtual-tree>
    </div>
</template>

<script>
import VirtualTree from '@/components/TreeWraper/index.vue';
// import { data } from '@/mock'
import { data } from '@/utils/data.js'
export default {
    name: 'tree-demo',
    components: {
        VirtualTree
    },
    data() {
        return {
            data: data
        }
    }
}
</script>
<style>
.demo-container {
    background: #eee;
    width: 800px;
    margin: 100px auto;
}
</style>
