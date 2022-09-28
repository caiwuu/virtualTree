<template>
  <div>
    <div class="zg-tree" v-for="(item,index) in data" :key="index"
      :style="{marginLeft:(item.level * levelDistance)+'px'}" @click="collapseChange(item,index)">
      <div class="zg-triangle">
        <div class="zg-triangle-right" v-if="item.collapsed && !item.isLeaf"></div>
        <div class="zg-triangle-bottom" v-if="!item.collapsed && !item.isLeaf"></div>
      </div>
      <div class="zg-content">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
// import { data } from '@/utils/data'
import { data } from '@/mock'
export default {
  components: {},
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
      data: data.list
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
  height: 26px;
  line-height: 26px;
  user-select: none;
}

<<<<<<< Updated upstream .zg-content {
  display: inline-block;
  vertical-align: middle;
}

=======>>>>>>>Stashed changes .zg-triangle {
  width: 20px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}

.zg-triangle-right {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 6px solid #c0c4cc;
  border-right: 0 solid transparent;
  border-bottom: 4px solid transparent;
}

.zg-triangle-bottom {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 6px solid #c0c4cc;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 0 solid transparent;
}
</style>
