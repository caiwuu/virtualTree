<template>
  <div>
    <div class="zg-tree" v-for="(item,index) in data" :key="index" :style="{marginLeft:((item.level-1) * levelDistance)+'px'}"  @click="collapseChange(item,index)">
      <div class="zg-triangle" v-if="item.collapsed">
        <div class="zg-triangle-right"></div>
      </div>
      <div class="zg-triangle" v-else>
        <div class="zg-triangle-bottom"></div>
      </div>
      <span>
         {{item.name}}
      </span>
    </div>
  </div>
</template>

<script>
import {data} from '../../utils/data.js'
export default {
  components: { },
  props: {
    levelDistance: {
      type: [Number],
      default: 10,
    },
    top: {
      type: [String, Number],
      top: 0,
    },
  },
  data() {
    return {
      data
    };
  },
  computed() {
  },
  methods: {
    /**
     * 获取孩子是否存在
     * @param id
     * @returns {boolean}
     */
    hasChild(id) {
      return this.data.some(e => id === e.pid)
    },
    /**
     * tree行点击事件
     * @param id
     * @returns {boolean}
     */
    collapseChange(item, index) {
      item.collapsed = !item.collapsed
      this.$emit('collapseChange')
    },
  },
};
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
.zg-tree {
  width: 200px;
  height: 30px;
  user-select: none;
}
.zg-triangle {
  width: 20px;
  text-align: center;
  display: inline-block;
}
.zg-triangle-right {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-left: 8px solid #c0c4cc;
  border-right: 0 solid transparent;
  border-bottom: 6px solid transparent;
}
.zg-triangle-bottom {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 8px solid #c0c4cc;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 0 solid transparent;
}
</style>
