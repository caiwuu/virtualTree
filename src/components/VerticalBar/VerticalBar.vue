<template>
  <!-- 虚拟滚动整体 -->
  <div class="VerticalBar" @click="handleVerticalBarClick" ref="VerticalBar">
    <!-- 虚拟滚动条 -->
    <div
      class="bar"
      :style="{
        height: height + 'px',
        top: top + 'px',
      }"
      @click="handleBarClick"
      @mousedown="handleMouseDown"
    ></div>
  </div>
</template>
<script>
export default {
  name: "VerticalBar",
  data() {
    return {
      mouseDownFlag: false, //是否鼠标滑动
      mouseDownY: 0, // 移动距离
      topBackUp: 0, // 距离顶部的距离
    };
  },
  props: {
    height: {
      type: [String, Number],
      default: 0,
    },
    top: {
      type: [String, Number],
      top: 0,
    },
  },
  methods: {
    handleBarClick(e) {
      e.stopPropagation();
      return false;
    },
    // 虚拟滚动轨道被点击时触发滚动条的位移，位移量为滚动条的中部移动到鼠标位置
    handleVerticalBarClick(e) {
      console.log("滚动轨道被点击", e.clientY);
      // 计算当前滚动条位置
      const top = e.clientY - this.height / 2;
      this.setTop(top);
    },
    handleMouseDown(e) {
      //左0，中1，右2，目前阻断中键和右键，后期考虑可添加右键菜单
      console.log("鼠标", e.button);
      if (e.button !== 0) {
        return;
      }
      console.log("e.clientY", e.clientY);
      this.mouseDownFlag = true;
      this.mouseDownY = e.clientY;
      this.topBackUp = this.top;
      // 在鼠标按下时加入监听事件
      // 监听鼠标滑动事件
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    // 鼠标移动事件
    handleMouseMove(e) {
      e.stopPropagation();
      // 阻断异常
      if (!this.mouseDownFlag) {
        return;
      }

      // 计算top值
      const top = this.topBackUp + e.clientY - this.mouseDownY;
      console.log("鼠标移动事件", top);
      this.setTop(top);
    },
    // 鼠标松开事件
    handleMouseUp() {
      console.log("鼠标松开事件");
      this.mouseDownFlag = false;
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
    // 设置距离顶部距离
    setTop(top) {
      // 方位计算
      // topMax计算bar在最上方时底部距离整个滚动条单元底部的距离，也是最大滑动距离
      const topMax = this.$refs["VerticalBar"].clientHeight - this.height;
      // top小于0，意味着滚动条的中心位置位移到鼠标位置时，滚动条高度会超出滚动轨道，所以直接将滚动条置顶
      if (top <= 0) {
        top = 0;
      }
      // 同理，将滚动条置底
      else if (top > topMax) {
        top = topMax;
      }
      console.log("top", top);
      // 值改变时，通知主组件变更
      if (top != this.top) {
        this.$emit("on-top-change", top);
      }
    },
  },
};
</script>
<style>
.VerticalBar {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 5px;
  height: 100%;
  background: blue;
}
.bar {
  position: absolute;
  width: 100%;
  background: red;
  border-radius: 4px;
}
</style>
