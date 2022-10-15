/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-13 10:59:51
 */
export default class {
  start = 0
  end = 0
  translateY = 0
  oneClientRowSize = 0
  eventHandle = {}
  pageNo = 1
  constructor(config) {
    const { container, rowHeight, sectionSize, isStatic, dataSize } = config
    this.container = container
    this.rowHeight = rowHeight
    this.sectionSize = sectionSize
    this.isStatic = isStatic
    this.dataSize = dataSize
  }
  on(eventName, fn) {
    this.eventHandle[eventName] = fn
  }
  // 启动引擎 需要在container挂载之后启动
  run(fn) {
    this.initContainerDom()
    // 校验启动参数
    const oneClientRowSize = Math.ceil(this.container.clientHeight / this.rowHeight)
    if (!this.sectionSize) this.sectionSize = oneClientRowSize
    this.end = this.sectionSize * 4 - 1
    if (this.sectionSize < oneClientRowSize) {
      const error = `sectionSize太小不满足引擎启动要求,应大于等于${oneClientRowSize}`
      throw new Error(error)
    }
    this.listenScroll()
    this.rangeChange()
    this.pageChange()
    fn(this)
  }
  rangeChange() {
    this.eventHandle['rangeChange'](this.start, this.end)
  }
  pageChange() {
    if (this.isStatic) return
    this.eventHandle['pageChange'](this.pageNo, this.sectionSize * 4)
  }
  started() {
    this.eventHandle['started']({
      clientHeight: this.container.clientHeight,
    })
  }
  scrollHander(e) {
    const forwardCriticalPoint = Math.ceil((this.start + this.end) / 2) // 指针前进临界点
    const backCriticalPoint = forwardCriticalPoint - this.sectionSize // 指针后退临界点
    if (e.target.scrollTop > forwardCriticalPoint * this.rowHeight) {
      this.start += this.sectionSize
      this.end += this.sectionSize
      this.rangeChange()
    }
    if (e.target.scrollTop < backCriticalPoint * this.rowHeight && this.start > 0) {
      this.start -= this.sectionSize
      this.end -= this.sectionSize
      this.rangeChange()
    }
    if (this.end + this.sectionSize > this.sectionSize * 4 * this.pageNo) {
      // 需要增加数据
      this.pageNo++
    }
    this.$scrollBar.updateScrollTop(e.target.scrollTop)
  }
  // 监听滚动条
  listenScroll() {
    this.container.addEventListener('scroll', this.scrollHander.bind(this))
  }
  // 挂载之后初始化容器dom
  initContainerDom() {
    if (this.container instanceof HTMLElement) {
      return
    } else if (/#.*/.test(this.container)) {
      let dom = document.getElementById(this.container.slice(1))
      if (dom) {
        this.container = dom
      }
    } else if (/\..*/.test(this.container)) {
      let dom = document.getElementsByClassName(this.container.slice(1))[0]
      if (dom) {
        this.container = dom
      }
    } else {
      throw new Error('列表容器初始化失败')
    }
  }
}
