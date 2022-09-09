<template>
  <div class="vertical-tree-client" ref="client">
    <div ref="wrap">
      <slot></slot>
    </div>
    <Vertical-bar
      :height="barHeight"
      :top="barTop"
      @on-top-change="handleTopChange"
    >
    </Vertical-bar>
  </div>
</template>

<script>
import VerticalBar from "./VerticalBar.vue";
export default {
  components: { VerticalBar },
  data() {
    return {
      // neirong位置
      scrollTop: 0,
      // 滚动条位置
      barTop: 0,
      // 滚动条高度
      barHeight: 0,
    };
  },
  methods: {
    onscrollChange() {
      this.$emit("onScrollChange", this.scrollTop);
    },
    handleTopChange(){
      const percentage = top / (this.$refs['client'].clientHeight - this.barHeight);
        const scrollTop = (this.$refs.wrap.clientHeight - this.$refs['client'].clientHeight) * percentage;

        this.setScrollTop(scrollTop);
        this.onscrollChange();
    },
    // 在内容改变时计算高度
    setScrollTop(scrollTop) {
      const orignTop = this.scrollTop;
      let topMax = 0;
      if (
        this.$refs["wrap"].clientHeight - this.$refs["client"].clientHeight <
        0
      ) {
        topMax = 0;
      } else {
        topMax =
          this.$refs["wrap"].clientHeight - this.$refs["client"].clientHeight;
      }
      if (scrollTop < 0) {
        scrollTop = 0;
      }
      if (scrollTop > topMax) {
        scrollTop = topMax;
      }
      if (scrollTop != orignTop) {
        this.scrollTop = scrollTop;
        this.barTop =
          (this.scrollTop /
            (this.$refs["wrap"].clientHeight -
              this.$refs["client"].clientHeight)) *
          (this.$refs["client"].clientHeight - this.barHeight);
        this.onscrollChange();
      }
    },
  },
};
</script>

<style>
.vertical-tree-client {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
