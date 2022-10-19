<!--
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-18 15:24:50
-->
<template>
  <div class="container">
    <div class="button-container">
      <span class="button" @click="getSelection">获取当前选中</span>
      <span class="button" @click="selectOther">指定勾选</span>
      <span class="button" @click="setColor">设置颜色</span>
    </div>
    <div class="demo-container">
      <virtual-tree ref="virtualTree" v-slot="{row}" :config="config" :sourceData="data">
        {{row.name}}
      </virtual-tree>
    </div>
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
        color: '#409eff',
        currentNodeKey: [],
        itemHeight: 26,
        levelDistance: 20,
        showCheckbox: true,
        height: 400,
        width: 800,
      }
    }
  },
  methods: {
    getSelection(){
      console.log(this.$refs.virtualTree.getSelect());
    },
    selectOther(){
      this.config.currentNodeKey = [1];
      console.log(this.$refs.virtualTree.getSelect());
    },
    setColor(){
      this.config.color === "#86c734" ? this.config.color = "#409eff" : this.config.color = "#86c734"
    }
  }
}
</script>
<style>
.button-container {
  width: 800px;
  margin: 0 auto;
  margin-top: 100px;
}
.button {
  border: 1px solid #ddd;
  padding: 2px 10px;
  display: inline-block;
  height: 26px;
  line-height: 26px;
  box-sizing: content-box;
  border-radius: 4px;
  cursor: pointer;
  background: #409eff;
  color: #ffffff;
}
.button:hover {
  background: #087cff;
}
.button:not(:first-child) {
  margin-left: 10px;
}
.demo-container {
  background: #eee;
  width: 800px;
  margin: 10px auto;
}
</style>
