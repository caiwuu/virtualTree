<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-09-29 13:32:44
-->
<template>
    <zg-tree :sourceData="data" @collapseChange="collapseChange"></zg-tree>
</template>

<script>
import zgTree from '@/components/ZgTree/ZgTree.vue';
console.log(zgTree);
import { data } from '@/mock'
export default {
    components: {
        zgTree
    },
    data() {
        return {
            data: data.list
        }
    },
    methods: {
        collapseChange(item, index) {
            console.log(item, index);
        },
    }
}
</script>