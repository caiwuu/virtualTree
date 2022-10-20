<!--
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-20 19:15:06
-->
<template>
  <div class="container">
    <div class="button-container">
      <span class="button" @click="getSeleced">获取当前选中</span>
      <span class="button" @click="selectByIds">设置勾选</span>
      <span class="button" @click="clearSelect">取消勾选</span>
      <span class="button" @click="setColor">设置颜色</span>
    </div>
    <div class="demo-container">
      <virtual-tree
        :default-checked-keys="defaultCheckedKeys"
        ref="virtualTree"
        v-slot="{ row }"
        :height="400"
        :width="800"
        :row-height="36"
        :data="data"
        :level-indent="20"
        :checkbox-bg="checkboxBg"
        show-checkbox
        @selectChange="selectChange"
      >
        {{ row.name }}
      </virtual-tree>
    </div>
  </div>
</template>

<script>
import VirtualTree from '@/components/wraper/Wraper.vue'
import { data } from '@/mock'
export default {
  name: 'tree-demo',
  components: {
    VirtualTree,
  },
  data() {
    return {
      data: data,
      defaultCheckedKeys: [],
      checkboxBg: '',
    }
  },
  methods: {
    selectChange(list) {
      console.log(list)
    },
    getSeleced() {
      console.log(this.$refs.virtualTree.getSelect())
    },
    clearSelect() {
      this.defaultCheckedKeys = []
    },
    selectByIds() {
      this.defaultCheckedKeys = [1, 2, 3, 4]
      console.log(this.$refs.virtualTree.getSelect())
    },
    setColor() {
      this.checkboxBg === '#86c734' ? (this.checkboxBg = '#409eff') : (this.checkboxBg = '#86c734')
    },
  },
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
