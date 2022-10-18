/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-10-18 13:26:02
 */
import emit from 'mitt'
const emitter = emit()
export default class {
  start = 0 // 数据区间开始
  end = 0 // 数据区间结束
  oneScreenHoldingSize = 0 // 一屏可容纳原生的量
  pageNo = 1 // 页码
  constructor(config) {
    const { container, rowHeight, sectionSize, isStatic, dataSize } = config
    this.container = container // 树容器
    this.rowHeight = rowHeight // 每一项高度
    this.sectionSize = sectionSize // 缓存区段大小
    this.isStatic = isStatic // 是否静态数据
    this.dataSize = dataSize // 总数据量（activeData大小）
  }
  on(eventName, fn) {
    emitter.on(eventName, fn)
  }
  emit(eventName, args) {
    emitter.emit(eventName, args)
  }
  setRange(start) {
    this.start = start
    this.end = this.start + this.sectionSize * 4 - 1
    this.rangeChange()
  }
  // 启动引擎 需要在container挂载之后启动
  run(fn) {
    this.initContainerDom()
    // 校验启动参数
    const oneScreenHoldingSize = Math.ceil(this.container.clientHeight / this.rowHeight)
    if (!this.sectionSize) this.sectionSize = oneScreenHoldingSize
    if (this.sectionSize < oneScreenHoldingSize) {
      const error = `sectionSize太小不满足引擎启动要求,应大于等于${oneScreenHoldingSize}`
      throw new Error(error)
    }
    this.setRange(0)
    this.listenScroll()
    this.pageChange()
    fn(this)
  }
  rangeChange() {
    this.emit('rangeChange', { start: this.start, end: this.end })
  }
  pageChange() {
    if (this.isStatic) return
    this.emit('pageChange', { pageNo: this.pageNo, pageSize: this.sectionSize * 4 })
  }
  scrollHander(e) {
    const forwardCriticalPoint = Math.ceil((this.start + this.end) / 2) // 指针前进临界点
    const backCriticalPoint = forwardCriticalPoint - this.sectionSize // 指针后退临界点
    if (e.target.scrollTop > forwardCriticalPoint * this.rowHeight) {
      this.setRange(this.start + this.sectionSize)
    }
    if (e.target.scrollTop < backCriticalPoint * this.rowHeight && this.start > 0) {
      this.setRange(this.start - this.sectionSize)
    }
    if (this.end + this.sectionSize > this.sectionSize * 4 * this.pageNo) {
      // 需要增加数据
      this.pageNo++
      this.pageChange()
    }
    this.emit('scroll', e.target.scrollTop)
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
