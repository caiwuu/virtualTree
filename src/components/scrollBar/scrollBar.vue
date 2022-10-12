<template>
  <div @click="handleMouseMove" ref="scrollTrack" class="scroll-track">
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
      }
    },
    props: {
      height: {
        type: Number,
      },
    },
    computed: {
      style() {
        return `top:${this.top}px;height: ${this.minHeight}px;`
      },
    },
    methods: {
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
        } else if (top > this.height - this.minHeight) {
          top = this.height - this.minHeight
        }
        this.top = top
        console.log(top)
      },
    },
    mounted() {
      console.log(this.$refs.scrollTrack)
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
