<template>
    <div class="tree-wraper" :style="style">
        <zg-tree v-bind="config" :sourceData="sourceData" @collapseChange="collapseChange"></zg-tree>
    </div>
</template>

<script>
import zgTree from '@/components/ZgTree/ZgTree.vue';
export default {
    name: 'VirtualTree',
    props: {
        // 全量数据模式
        sourceData: {
            type: Array,
            default: () => []
        },
        config: {
            type: Object,
            default: () => ({
                itemHeight: 40,
                levelDistance: 20,
                showCheckbox: true,
                height: 400
            })
        }
    },
    data() {
        return {
        }
    },
    methods: {
        collapseChange(item, index) {
            console.log(item, index);
        },
    },
    computed: {
        style() {
            return `height:${this.config.height}px;overflow: auto;scroll-behavior: smooth`
        },
        // list() {

        // },
    },
    components: {
        zgTree
    },
}
</script>
