<template>
  <div @click="handleMouseMove" :style="{ display: hidden ? 'none' : 'block' }" ref="scrollTrack" class="scroll-track">
    <div @mousedown="handleMouseDown" ref="scrollItem" class="scroll-item" :style="style"></div>
  </div>
</template>

<script>
function pauseEvent (e) {
  if (e.stopPropagation) e.stopPropagation()
  if (e.preventDefault) e.preventDefault()
  e.cancelBubble = true
  e.returnValue = false
  return false
}
export default {
  data () {
    return {
      top: 0,
      minHeight: 15,
      scrollHeight: 0,
      hidden: false,
      trackItemTop: 0,
    }
  },
  props: {
    height: {
      type: Number,
    },
  },
  computed: {
    style () {
      return `top:${this.top}px;height: ${this.scrollHeight}px;`
    },
    totalHeight () {
      return this.ve.dataSize * this.ve.rowHeight
    },
    trackHeight () {
      return this.height - this.minHeight
    },
  },
  methods: {
    // 连接 计算引擎VirtualEngine
    connect (ve) {
      this.ve = ve
      this.updateSize()
      this.ve.on('scroll', (top) => {
        this.updateScrollTop(top)
      })
      this.ve.on('dataSize', (v) => {
        this.ve.dataSize = v
        this.updateSize()
      })
    },
    // 更新模拟滚动条高度
    updateSize () {
      console.log(this.ve.container.clientHeight, this.totalHeight, this.trackHeight, this.minHeight, this.ve.dataSize);
      if (this.ve.container.clientHeight >= this.totalHeight) {
        this.hidden = true
      } else {
        this.hidden = false
        this.scrollHeight =
          (this.ve.container.clientHeight / this.totalHeight) * this.trackHeight + this.minHeight
      }
    },
    // 更新模拟滚动条位置
    updateScrollTop (top) {
      this.top = (top * this.trackHeight) / this.totalHeight
    },
    // 根据模拟滚动条的top距离去计算VirtualEngine的 数据区间 和 真实滚动条位置
    updateVt (top) {
      console.log(top);
      const scrollTopRatio = top / this.trackHeight
      const outScreenNum = Math.floor(scrollTopRatio * this.ve.dataSize)
      const scrollTopSection = Math.floor(outScreenNum / this.ve.sectionSize)
      const scrollTop = scrollTopRatio * this.totalHeight
      const offsetSection = scrollTopSection - 2
      if (offsetSection >= 0) {
        if (scrollTop > scrollTopSection * this.ve.sectionSize * this.ve.rowHeight) {
          // this.ve.setRange((offsetSection + 1) * this.ve.sectionSize)
        }
      } else {
        this.ve.setRange(0)
      }
      setTimeout(() => {
        this.ve.container.scrollTop = scrollTop
        console.log(this.ve.container.scrollTop, this.ve.container, scrollTop, this.ve.start);
      }, 0)
    },
    handleMouseDown (e) {
      const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
      this.trackItemTop =
        y - (this.$refs.scrollItem.getBoundingClientRect().top + window.pageYOffset)

      pauseEvent(e)
      window.addEventListener('mousemove', this.handleMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseUp (e) {
      pauseEvent(e)
      window.removeEventListener('mousemove', this.handleMouseMove)
      setTimeout(() => {
        this.trackItemTop = this.scrollHeight / 2
      })
    },
    handleMouseMove (e) {
      const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
      let top =
        y -
        (this.$refs.scrollTrack.getBoundingClientRect().top + window.pageYOffset) -
        this.trackItemTop
      if (top < 0) {
        top = 0
      } else if (top > this.height - this.scrollHeight) {
        top = this.height - this.scrollHeight
      }
      this.top = top
      console.log(11);
      this.updateVt(top)
    },
  },
}
</script>
<style scoped>
.scroll-item {
  width: 6px;
  background: #d5d5d5;
  border-radius: 6px;
  position: absolute;
}

.scroll-item:hover {
  background: #c1c1c1;
}

.scroll-track {
  background: #ededed;
  width: 6px;
  position: relative;
}
</style>
