/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-30 17:31:33
 */
export default class {
  start = 0
  end = 0
  translateY = 0
  oneClientRowSize = 0
  eventHandle = {}
  constructor(config) {
    const { container, pageSize, rowHeight, pageNo } = config
    this.container = container
    this.pageSize = pageSize
    this.pageNo = pageNo
    this.rowHeight = rowHeight
  }
  on(eventName, fn) {
    this.eventHandle[eventName] = fn
  }
  // 启动引擎 需要在container挂载之后启动
  run() {
    this.initContainerDom()
    // 校验启动参数
    this.oneClientRowSize = Math.ceil(this.container.clientHeight / this.rowHeight)
    this.end = this.oneClientRowSize * 4 - 1
    if (this.pageSize < this.oneClientRowSize * 4) {
      const error = `pageSize太小不满足引擎启动要求,应大于等于${this.oneClientRowSize * 4}`
      throw new Error(error)
    }
    this.listenScroll()
    this.rangeChange()
  }
  rangeChange() {
    this.eventHandle['rangeChange'](this.start, this.end)
    this.container.scrollTop + this.oneClientRowSize * this.rowHeight
  }
  scrollHander(e) {
    const forwardCriticalPoint = Math.ceil((this.start + this.end) / 2) // 指针前进临界点
    const backCriticalPoint = forwardCriticalPoint - this.oneClientRowSize // 指针后退临界点
    if (e.target.scrollTop > forwardCriticalPoint * this.rowHeight) {
      this.start += this.oneClientRowSize
      this.end += this.oneClientRowSize
      this.rangeChange()
    }
    if (e.target.scrollTop < backCriticalPoint * this.rowHeight && this.start > 0) {
      this.start -= this.oneClientRowSize
      this.end -= this.oneClientRowSize
      this.rangeChange()
    }
    if (this.end + this.oneClientRowSize > this.pageSize * this.pageNo) {
      // 需要增加数据
      this.pageNo++
      this.eventHandle['pageNoChange'](this.pageNo, this.pageSize)
    }
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
