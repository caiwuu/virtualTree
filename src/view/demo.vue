<!--
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-07 17:25:21
-->
<template>
  <div class="container">
    <div v-if="gening" class="mask">mock数据生成中....</div>
    <div style="display: flex;justify-content: center;margin-top: 100px">
      <div>
      数据量：
      <span :class="l === 0 ? 'btn-active' : 'btn'" @click="() => setDataSize(0, 1, 3, 5)">15</span>
      <span :class="l === 1 ? 'btn-active' : 'btn'" @click="() => setDataSize(1, 1, 10, 10)">100</span>
      <span :class="l === 2 ? 'btn-active' : 'btn'" @click="() => setDataSize(2, 3, 10, 10)">300</span>
      <span :class="l === 3 ? 'btn-active' : 'btn'" @click="() => setDataSize(3, 10, 10, 10)">1000</span>
      <span :class="l === 4 ? 'btn-active' : 'btn'" @click="() => setDataSize(4, 100, 100, 100)">1000000</span>
    </div>
    <div >
      <span class="button" @click="getSeleced">获取当前选中</span>
      <span class="button" @click="selectByIds">设置勾选</span>
      <span class="button" @click="clearSelect">取消勾选</span>
      <!-- <span class="button" @click="isShowCheckbox">隐藏展示勾选</span> -->
      <span class="button" @click="isShowOperateBtn">隐藏展示操作</span>
    </div>
    </div>
    <div class="demo-container">
      <v-tree :key="key" :default-checked-keys="defaultCheckedKeys" ref="virtualTree" v-slot="{ row }"
        :height="600" :width="800" :row-height="24" :data="data" :level-indent="20" :checkbox-bg="checkboxBg"
        :show-checkbox="showCheckbox" @select-change="selectChange" @node-click="nodeClick">
        {{ row.position }}
        <span v-if="showOperateBtn">
          <span class="operateBtn" @click.stop="update(row)"><svg t="1666276805678" class="icon" viewBox="0 0 1024 1024"
              version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4033" width="16" height="16">
              <path
                d="M768 864a96.2 96.2 0 0 0 27.89-4.11C783.94 899.31 747.32 928 704 928H192c-53.02 0-96-42.98-96-96V320c0-43.32 28.69-79.94 68.11-91.89A96.2 96.2 0 0 0 160 256v512c0 53.02 42.98 96 96 96h512z"
                p-id="4034" fill="#67C23A"></path>
              <path
                d="M832 96H320c-43.32 0-79.94 28.69-91.89 68.11A96.2 96.2 0 0 0 224 192v512c0 53.02 42.98 96 96 96h512a96.2 96.2 0 0 0 27.89-4.11C899.31 783.94 928 747.32 928 704V192c0-53.02-42.98-96-96-96zM701.42 361.04L497.77 564.69 441.21 576l11.31-56.57 203.65-203.65c12.49-12.49 32.75-12.49 45.25 0 12.5 12.5 12.5 32.76 0 45.26z"
                p-id="4035" fill="#67C23A"></path>
            </svg></span>
          <span class="operateBtn" @click.stop="add(row)"><svg t="1666277092401" class="icon" viewBox="0 0 1024 1024"
              version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4445" width="16" height="16">
              <path
                d="M924.8 337.6c-22.6-53.4-54.9-101.3-96-142.4-41.1-41.1-89-73.4-142.4-96C631.1 75.8 572.5 64 512 64S392.9 75.8 337.6 99.2c-53.4 22.6-101.3 54.9-142.4 96-41.1 41.1-73.4 89-96 142.4C75.8 392.9 64 451.5 64 512s11.8 119.1 35.2 174.4c22.6 53.4 54.9 101.3 96 142.4 41.1 41.1 89 73.4 142.4 96C392.9 948.2 451.5 960 512 960s119.1-11.8 174.4-35.2c53.4-22.6 101.3-54.9 142.4-96 41.1-41.1 73.4-89 96-142.4C948.2 631.1 960 572.5 960 512s-11.8-119.1-35.2-174.4zM758.63 534.63c-5.79 5.79-13.79 9.37-22.63 9.37H288c-17.67 0-32-14.33-32-32 0-8.84 3.58-16.84 9.37-22.63S279.16 480 288 480h448c17.67 0 32 14.33 32 32 0 8.84-3.58 16.84-9.37 22.63z"
                p-id="4446" fill="#E6A23C"></path>
            </svg></span>
          <span class="operateBtn" @click.stop="remove(row)"><svg t="1666277005829" class="icon" viewBox="0 0 1024 1024"
              version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4215" width="16" height="16">
              <path
                d="M924.8 337.6c-22.6-53.4-54.9-101.3-96-142.4-41.1-41.1-89-73.4-142.4-96C631.1 75.8 572.5 64 512 64S392.9 75.8 337.6 99.2c-53.4 22.6-101.3 54.9-142.4 96-41.1 41.1-73.4 89-96 142.4C75.8 392.9 64 451.5 64 512s11.8 119.1 35.2 174.4c22.6 53.4 54.9 101.3 96 142.4 41.1 41.1 89 73.4 142.4 96C392.9 948.2 451.5 960 512 960s119.1-11.8 174.4-35.2c53.4-22.6 101.3-54.9 142.4-96 41.1-41.1 73.4-89 96-142.4C948.2 631.1 960 572.5 960 512s-11.8-119.1-35.2-174.4zM758.63 534.63c-5.79 5.79-13.79 9.37-22.63 9.37H544v192c0 17.67-14.33 32-32 32-8.84 0-16.84-3.58-22.63-9.37S480 744.84 480 736V544H288c-17.67 0-32-14.33-32-32 0-8.84 3.58-16.84 9.37-22.63S279.16 480 288 480h192V288c0-17.67 14.33-32 32-32 8.84 0 16.84 3.58 22.63 9.37S544 279.16 544 288v192h192c17.67 0 32 14.33 32 32 0 8.84-3.58 16.84-9.37 22.63z"
                p-id="4216" fill="#F56C6C"></path>
            </svg></span>
        </span>
      </v-tree>
    </div>
  </div>
</template>

<script>
import VTree from '@/lib/VTree.vue'
import { genTreeData } from '@/mock'
export default {
  name: 'tree-demo',
  components: {
    VTree,
  },
  data () {
    return {
      gening: false,
      l: 0,
      key: 112,
      data0: [],
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data: [],
      defaultCheckedKeys: [],
      checkboxBg: '',
      showCheckbox: true,
      showOperateBtn: false,
    }
  },
  created () {
    this.setDataSize(0, 1, 3, 5)
  },
  methods: {
    setDataSize (l, i, j, k) {
      this.l = l
      this.data = this[`data${l}`]
      console.log(this.data.length);
      if (!this.data.length) {
        this.gening = true
        setTimeout(() => {
          this.data = this[`data${l}`] = genTreeData(i, j, k) // 视图更新了
          this.gening = false
          this.key++
        }, 0)
      } else {
        this.key++
      }


    },
    dataFn (pageNo, pageSize) {
      console.log(pageNo, pageSize)
      return []
    },
    update (row) {
      console.log('更新', row)
    },
    add (row) {
      console.log('添加', row)
    },
    remove (row) {
      console.log('删除', row)
    },
    isShowOperateBtn () {
      this.showOperateBtn = !this.showOperateBtn
    },
    selectChange (rows) {
      console.log('select-change', rows)
    },
    nodeClick (row) {
      console.log('node-click', row)
    },
    getSeleced () {
      console.log(this.$refs.virtualTree.getSelect())
      alert(JSON.stringify(this.$refs.virtualTree.getSelect()))
    },
    clearSelect () {
      this.defaultCheckedKeys = []
    },
    selectByIds () {
      this.defaultCheckedKeys = ['0-0-0', '0-0-2']
      alert("设置选中：['0-0-0', '0-0-2']")
    },
    isShowCheckbox () {
      this.showCheckbox = !this.showCheckbox
    },
    setColor () {
      this.checkboxBg === '' ? (this.checkboxBg = '#ffe3d5') : (this.checkboxBg = '')
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

.button,
.btn-active {
  user-select: none;
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

.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 1000;
  background: #333;
  opacity: 0.7;
  font-size: 36px;
  text-align: center;
  line-height: 100vh;
  color: #f9f9f9;
}

.btn {
  user-select: none;
  border: 1px solid #ddd;
  padding: 2px 10px;
  display: inline-block;
  height: 26px;
  line-height: 26px;
  box-sizing: content-box;
  border-radius: 4px;
  cursor: pointer;
  background: #cacaca;
  color: #ffffff;
}

.button:hover {
  background: #087cff;
}

.button:not(:first-child) {
  margin-left: 10px;
}

.operateBtn:not(:first-child) {
  margin-left: 10px;
}

.demo-container {
  background: #ffffff;
  width: 800px;
  margin: 10px auto;
}
</style>
