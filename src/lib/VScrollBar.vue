<template>
  <div
    @mousedown="handleMouseDown"
    :style="{ display: hidden ? 'none' : 'block' }"
    ref="scrollTrack"
    class="scroll-track"
  >
    <div data-type="1" ref="scrollItem" class="scroll-item" :style="style"></div>
  </div>
</template>

<script>
let ve = null
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
      scrollMinHeight: 15,
      scrollHeight: 0,
      hidden: false,
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
      return ve.dataSize * ve.rowHeight
    },
    trackHeight () {
      return this.height - this.scrollMinHeight
    },
  },
  methods: {
    // 连接 计算引擎VirtualEngine
    connect (v) {
      ve = v
      this.updateSize()
      ve.on('scroll', (top) => {
        this.updateScrollTop(top)
      })
      ve.on('dataSize', (v) => {
        ve.dataSize = v
        this.updateSize()
      })
    },
    // 更新模拟滚动条高度
    updateSize () {
      if (ve.container.clientHeight >= this.totalHeight) {
        this.hidden = true
      } else {
        this.hidden = false
        this.scrollHeight =
          (ve.container.clientHeight / this.totalHeight) * this.trackHeight + this.scrollMinHeight
      }
    },
    // 更新模拟滚动条位置
    updateScrollTop (top) {
      this.top = (top * this.trackHeight) / this.totalHeight
    },
    handleMouseDown (e) {
      pauseEvent(e)
      if (e.target.dataset.type === '1') {
        window.addEventListener('mousemove', this.handleMouseMove)
        window.addEventListener('mouseup', this.handleMouseUp)
      }
      this.computedTop(e)
    },
    handleMouseUp (e) {
      pauseEvent(e)
      window.removeEventListener('mousemove', this.handleMouseMove)
      window.removeEventListener('mouseup', this.handleMouseUp)
    },
    computedTop (e) {
      const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
      let top = y - (this.$refs.scrollTrack.getBoundingClientRect().top + window.scrollY) - this.scrollHeight / 2
      if (top < 0) {
        top = 0
      }
      else if (top > this.height - this.scrollHeight) {
        top = this.height - this.scrollHeight
      }
      this.top = top
      ve.update(top, this.trackHeight, this.totalHeight)
    },
    handleMouseMove (e) {
      this.computedTop(e)
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
