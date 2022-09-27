export default class VirtualListEngine {
    container = null
    step = 0 // 步长
    itemH = 0 // 每个列表元素的高度
    padding = 0 // 可视区域外面的padding
    hatH = 0 // 头部高度
    getData = null // 获取数据回调函数
    pageOpt = {
      pageSize: 20,
      pageNo: 1,
    }
    firstPageSize = 0 // 首次加载列表长度
    allListLength = 0 // 全部列表长度
    hasMoreData = true // 标记是否还有下一页
    generation = 1 // 指针代数
    pointer = {
      prev: 0, // 上一代指针的开始指针
      start: 0, // 开始指针
      end: 0, // 结束指针
      next: 0, // 下一代指针的结束指针
    }
    constructor(container, pageOpt, getData) {
      this.pointer.end = this.pageOpt.pageSize
      this.pageOpt = pageOpt
      this.getData = getData
      this.container = container
      this.getData(this.notice.bind(this), this.pageOpt)
    }
    // 初始化容器参数
    _initContainer() {
      let viewContentH = this.container.scrollHeight
      let viewAreaH = this.container.clientHeight // 一屏的高度
      this.hatH = viewContentH - viewAreaH
      this.itemH = viewContentH / this.firstPageSize
      this.step = Math.floor(this.hatH / this.itemH) // 步长
      this.pointer.next = this.pointer.end + this.step
    }
    // 指针前进
    addGeneration() {
      this.generation += 1
      this._reComputerPointer()
      return this.generation
    }
    // 指针计算
    _reComputerPointer() {
      this.pointer.start = this.step * (this.generation - 1)
      this.pointer.end = this.step * (this.generation - 1) + this.pageOpt.pageSize
      this.pointer.next = this.step * (this.generation - 1) + this.pageOpt.pageSize + this.step
      this.pointer.prev = this.pointer.start - this.step >= 0 ? this.pointer.start - this.step : 0
      this._reComputerPadding()
    }
    // 指针回退
    reduceGeneration() {
      this.generation -= 1
      this._reComputerPointer()
      return this.generation
    }
    // 重新计算padding
    _reComputerPadding() {
      this.padding = (this.generation - 1) * this.itemH * this.step
      this.container.children[0].setAttribute('style', `padding-top: ${this.padding}px !important`)
    }
    resetPointer() {
      this.hasMoreData = true
      this.pageOpt.pageNo = 1
      this.allListLength = 0
      this.generation = 1
      this._reComputerPointer()
    }
    destroy() {
      this.container.removeEventListener('scroll', this._scrollHander.bind(this))
    }
    // 监听滚动条
    _listenScroll() {
      this.container.addEventListener('scroll', this._scrollHander.bind(this))
    }
    // 滚动条处理函数
    _scrollHander(e) {
      // console.log(
      //   e.target.scrollTop,
      //   this.hatH,
      //   this.step,
      //   this.itemH,
      //   this.hatH + this.step * this.itemH * (this.generation - 1)
      // )
      if (e.target.scrollTop >= this.hatH + this.step * this.itemH * (this.generation - 1)) {
        this.addGeneration()
        if (this.pointer.next > this.allListLength - 1 && this.hasMoreData) {
          this.pageOpt.pageNo += 1
          this.getData(this.notice.bind(this), this.pageOpt)
        }
      }
      if (e.target.scrollTop < this.hatH + this.step * this.itemH * (this.generation - 2) && this.generation >= 2) {
        this.reduceGeneration()
      }
    }
    // 数据变化通知回调
    notice(n) {
      if (!this.firstPageSize) {
        this.firstPageSize = n
        this._initContainerDom()
        this._initContainer()
        this._listenScroll()
      }
      if (n - this.allListLength < this.pageOpt.pageSize) {
        this.hasMoreData = false
      }
      this.allListLength = n
    }
    // 初始化容器dom
    _initContainerDom() {
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