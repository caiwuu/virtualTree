<template>
  <!-- 虚拟滚动外框 -->
  <div class="scrollbar" :style="{height:height+'px'}" @mousewheel="handleMouseWheel" ref="view">
    <!-- 页面主体部分 -->
    <div :style="wrapStyles" ref="wrap">
      <slot></slot>
    </div>
    <!-- 滚动部分 -->
    <vertical-scroll :top.sync="barTop" :height="barHeight" @updateTop="updateTop">
    </vertical-scroll>
  </div>
</template>

<script>
import verticalScroll from "./verticalScroll.vue";
export default {
  name: "App",
  components: {
    verticalScroll,
  },
  props: {
    height: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      minHeight: 20, //最小高度
      scrollTop: 0,
      barTop: 0,
      barHeight: 0,
      wrapStyle: {
        "margin-top": 0,
      },
    };
  },
  computed: {
    wrapStyles() {
      this.wrapStyle["margin-top"] = -this.scrollTop + "px";
      return this.wrapStyle;
    },
  },
  mounted() {
    this.update();
  },
  watch: {
    barHeight(val) {
      console.log("滚动条高度");
    },
  },
  updated() {
    this.update();
  },
  methods: {
    handleMouseWheel(e) {
      const scrollTop =
        this.scrollTop + (e.deltaY > 0 ? this.deltaY : -this.deltaY);

      if (this.setScrollTop(scrollTop)) {
        e.preventDefault();
      }

      return false;
    },
    setScrollTop(scrollTop) {
      const orignTop = this.scrollTop;
      const maxTop = Math.max(
        this.$refs.wrap.clientHeight - this.$refs.view.clientHeight,
        0
      );

      scrollTop = Math.max(scrollTop, 0);
      scrollTop = Math.min(scrollTop, maxTop);

      if (scrollTop != orignTop) {
        this.scrollTop = scrollTop;
        this.barTop =
          (this.scrollTop /
            (this.$refs.wrap.clientHeight - this.$refs.view.clientHeight)) *
          (this.$refs.view.clientHeight - this.barHeight);

        this.scrollChanged();
        return true;
      }
      return false;
    },
    update() {
      const maxScrollTop =
        this.$refs.wrap.clientHeight - this.$refs.view.clientHeight;
      let height =
        (this.$refs.view.clientHeight / this.$refs.wrap.clientHeight) *
        this.$refs.view.clientHeight;
      height = Math.max(height, this.minHeight);

      if (this.barHeight != height) {
        this.barHeight = height;
      }

      if (this.scrollTop > maxScrollTop) {
        this.setScrollTop(maxScrollTop);
      }
    },
    updateTop(top) {
      const percentage = top / (this.$refs.view.clientHeight - this.barHeight);
      const scrollTop =
        (this.$refs.wrap.clientHeight - this.$refs.view.clientHeight) *
        percentage;

      this.setScrollTop(scrollTop);
      this.scrollChanged();
    },
    scrollChanged() {
      this.$emit("scrollChanged", Math.abs(this.scrollTop));
      return Math.abs(this.scrollTop);
    },
  },
};
</script>

<style scoped>
.scrollbar {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
