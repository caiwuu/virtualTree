<template>
  <div class="list" @scroll="scrollHandle" ref="list">
    <div
      class="item"
      v-for="(item, index) in renderList"
      :key="index"
      :style="`height:${itemHeight}px;line-height:${itemHeight}px;transform:translateY(${top}px)`"
    >
      {{ item }}
    </div>
  </div>
</template>
<script>
import throttle from "@/utils/throttle";
export default {
  name: "List",
  props: {
    list: {
      // 完整列表
      type: Array,
      require: true,
    },
    itemHeight: {
      // 每一项的高度
      type: Number,
      default: 599,
    },
    // 冗余条数，默认4条
    redundance:{
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      renderList: [], // 需要渲染的列表
      start: 0, // 开始渲染的位置
      volume: 0, // 页面的容积:能装下多少个节点
      top: 0,
      scroll, // 用于初始化节流
    };
  },
  watch: {
    list() {
      // 计算自身高度
      const cHeight = this.$el.offsetHeight;
      // 计算页面能容纳下几个节点并且设置{{redundance}}个节点作为冗余
      this.volume = Math.ceil(cHeight / this.itemHeight) + this.redundance;
      // 设置要渲染的列表 设置成能够容纳下的最大元素个数
      this.renderList = this.list.slice(0, this.volume);
    },
  },
  mounted() {
    // 初始化节流函数 最短50毫秒触发一次
    this.scroll = throttle(this.onScroll, 50);
  },
  methods: {
    scrollHandle() {
      this.scroll();
    },
    onScroll() {
      // scrollTop常量记录当前滚动的高度
      const scrollTop = this.$refs.list.scrollTop;
      const start = this.getCurStart(scrollTop);
      // 对比上一次的开始节点 比较是否发生变化，发生变化后便重新渲染列表
      if (this.start != start) {
        // 在这需要获得一个可以被itemHeight整除的数来作为item的偏移量
        const offsetY = scrollTop - (scrollTop % this.itemHeight);
        // 使用slice拿到需要渲染的那一部分
        this.renderList = this.list.slice(start, this.start + this.volume);
        // 这里的top用于设置translateY  transform:translateY(${top}px)
        this.top = offsetY;
      }
      this.start = start;
    },
    getCurStart(scrollTop) {
      // 没了多少个
      return Math.floor(scrollTop / this.itemHeight);
    },
  },
};
</script>
<style scoped>
.list {
  height: 100vh;
  overflow: scroll;
}
.item {
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid lightgray;
}
</style>
