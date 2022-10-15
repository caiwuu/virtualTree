<template>
  <div
    @click="handleMouseMove"
    :style="{ display: hidden ? 'none' : 'auto' }"
    ref="scrollTrack"
    class="scroll-track"
  >
    <div @mousedown="handleMouseDown" class="scroll-item" :style="style"></div>
  </div>
</template>

<script>
  function pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation()
    if (e.preventDefault) e.preventDefault()
    e.cancelBubble = true
    e.returnValue = false
    return false
  }
  export default {
    data() {
      return {
        top: 0,
        minHeight: 30,
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
      style() {
        return `top:${this.top}px;height: ${this.scrollHeight}px;`
      },
      totalHeight() {
        return this.ve.dataSize * this.ve.rowHeight
      },
      trackHeight() {
        return this.height - this.minHeight
      },
    },
    methods: {
      connect(ve) {
        this.ve = ve
        this.updateSize()
        this.ve.on('scroll', (top) => {
          this.top = (top * this.trackHeight) / this.totalHeight
        })
        this.ve.on('dataSize', (v) => {
          this.ve.dataSize = v
          this.updateSize()
        })
      },
      updateSize() {
        console.log(
          this.ve.container.clientHeight,
          this.totalHeight,
          this.trackHeight,
          this.minHeight
        )
        if (this.ve.container.clientHeight >= this.totalHeight) {
          this.hidden = true
        } else {
          this.scrollHeight =
            (this.ve.container.clientHeight / this.totalHeight) * this.trackHeight + this.minHeight
        }
      },
      updateScrollTop(top) {
        this.top = (top * this.trackHeight) / this.totalHeight
      },
      updateVt(top) {
        const scrollTopRatio = top / this.trackHeight
        const outScreenNum = Math.floor(scrollTopRatio * this.ve.dataSize)
        const scrollTopSection = Math.floor(outScreenNum / this.ve.sectionSize)
        const scrollTop = scrollTopRatio * this.totalHeight
        const offsetSection = scrollTopSection - 2
        if (offsetSection >= 0) {
          if (scrollTop > scrollTopSection * this.ve.sectionSize * this.ve.rowHeight) {
            this.ve.start = (offsetSection + 1) * this.ve.sectionSize
          }
        } else {
          this.ve.start = 0
        }
        this.ve.end = this.ve.start + this.ve.sectionSize * 4 - 1
        this.ve.rangeChange()
        setTimeout(() => {
          this.ve.container.scrollTop = scrollTop
        })
      },
      handleMouseDown(e) {
        pauseEvent(e)
        window.addEventListener('mousemove', this.handleMouseMove)
        window.addEventListener('mouseup', this.handleMouseUp)
      },
      handleMouseUp(e) {
        pauseEvent(e)
        window.removeEventListener('mousemove', this.handleMouseMove)
      },
      handleMouseMove(e) {
        const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
        let top = y - (this.$refs.scrollTrack.getBoundingClientRect().top + window.pageYOffset)
        if (top < 0) {
          top = 0
        } else if (top > this.height - this.scrollHeight) {
          top = this.height - this.scrollHeight
        }
        this.top = top
        this.updateVt(top)
      },
    },
  }
</script>
<style scoped>
  .scroll-item {
    width: 6px;
    background: #bdbdbd;
    border-radius: 6px;
    position: absolute;
    transition: top 60ms ease;
  }
  .scroll-item:hover {
    background: #8d8d8d;
  }
  .scroll-track {
    height: 400px;
    background: #e1e1e1;
    width: 6px;
    position: relative;
  }
</style>
