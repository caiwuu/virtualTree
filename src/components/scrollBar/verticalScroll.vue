<template>
  <!-- ref=view -->
  <div
    class="scrollbar-slider-vertical"
    ref="scrollbarSliderVertical"
    @click="handleClick"
    v-if="visiable"
  >
    <div
      class="scrollbar-bar"
      :style="{ height: height + 'px', top: top + 'px' }"
      @click="handleBarClick"
      @mousedown="handleMouseDown"
    ></div>
  </div>
</template>

<script>
  export default {
    name: 'verticalScroll',
    props: {
      // 是否展示滚动条
      visiable: {
        type: Boolean,
        default: true,
      },
      // 滚动条距离顶部高度
      top: {
        type: Number,
        default: 20,
      },
      // 滚动条高度
      height: {
        type: Number,
        default: 100,
      },
    },
    data() {
      return {
        mousedownFlag: false, // 鼠标点击flag
        mousedownY: 0, // 鼠标点击位置
        movingFlag: false, // 下滑flag
        topBackup: 0, // 滚动条距离顶部距离，便于操作传入top
      }
    },
    methods: {
      // 鼠标按下回调
      handleMouseDown(e) {
        // 开启点击Flag
        this.mouseDownFlag = true
        // 记录当前位置，便于叠加
        this.mouseDownY = e.clientY
        // 记录距离顶部位置
        this.topBackup = this.top
        // 鼠标点击，添加监听其他事件
        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseup', this.handleMouseUp)
      },
      // 鼠标移动回调
      handleMouseMove(e) {
        //先阻止调默认事件防止干扰
        e.preventDefault()
        // 判断是否打开移动flag
        if (!this.movingFlag) {
          // 打开移动flag
          this.movingFlag = true
          console.log('topBackup', this.topBackup)
          console.log('clientY', e.clientY)
          console.log('mouseDownY', this.mouseDownY)
          this.setVerticalBarTop(this.topBackup + e.clientY - this.mouseDownY)
          setTimeout(() => {
            this.movingFlag = false
          }, 30)
        }
      },
      // 设置滚动条位置
      setVerticalBarTop(top) {
        //获取最大滚动位移
        const maxTop = this.$refs['scrollbarSliderVertical'].clientHeight - this.height
        //小于0直接置顶
        if (top < 0) {
          top = 0
        }
        //大于最大位移直接置底
        if (top > maxTop) {
          top = maxTop
        }
        // 发出更新滚动条位置的消息
        if (this.top != top) {
          this.updateTop(top)
        }
      },
      // 鼠标抬起回调
      handleMouseUp(e) {
        console.log('鼠标抬起回调')
        this.mouseDownFlag = false

        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMouseUp)
        return false
      },
      // 点击滚动条回调
      handleClick(e) {
        // 滑块移动到鼠标位置，鼠标点为滑块中心点
        this.setVerticalBarTop(e.offsetY - this.height / 2)
      },

      handleBarClick(e) {
        // 阻止冒泡，防止点击滑块造成的位移
        e.preventDefault()
        return false
      },
      updateTop(top) {
        this.$emit('updateTop', top)
      },
    },
  }
</script>

<style scoped>
  .scrollbar-slider-vertical {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
  }
  .scrollbar-slider-vertical .scrollbar-bar {
    position: absolute;
    width: 100%;
    background: #000000;
    border-radius: 4px;
    opacity: 0.2;
  }
  .scrollbar-slider-vertical .scrollbar-bar:hover {
    opacity: 0.5;
    transition: all 0.5s ease-in-out;
  }
</style>
