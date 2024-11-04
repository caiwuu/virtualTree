/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-07 15:36:17
 */
import emit from 'mitt'
const emitter = emit()
export default class {
  start = 0 // 数据区间开始
  end = 0 // 数据区间结束
  oneScreenHoldingSize = 0 // 一屏可容纳原生的量
  pageNo = 1 // 页码
  includeKeys = []
  excludeKeys = []
  checkType = {
    UNCHECKED: 0,
    INDETERMINATE: 1,
    CHECKED: 2,
  }
  constructor(config) {
    const { container, rowHeight, sectionSize, isStatic, dataSize } = config
    this.container = container // 树容器
    this.rowHeight = rowHeight // 每一项高度
    this.sectionSize = sectionSize // 缓存区段大小
    this.isStatic = isStatic // 是否静态数据
    this.dataSize = dataSize // 总数据量（activeData大小）
  }
  on (eventName, fn) {
    emitter.on(eventName, fn)
  }
  emit (eventName, args) {
    emitter.emit(eventName, args)
  }
  setRange (start) {
    this.start = start
    this.end = this.start + this.sectionSize * 4 - 1
    this.rangeChange()
  }
  // 启动引擎 需要在container挂载之后启动
  run (fn) {
    console.log(emitter)
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
  rangeChange () {
    this.emit('rangeChange', { start: this.start, end: this.end })
  }
  pageChange () {
    if (this.isStatic) return
    this.emit('pageChange', { pageNo: this.pageNo, pageSize: this.sectionSize * 4 })
  }
  scrollHander (e) {
    console.log('scrollHander')
    const forwardCriticalPoint = Math.ceil((this.start + this.end) / 2) // 指针前进临界点
    const backCriticalPoint = forwardCriticalPoint - this.sectionSize // 指针后退临界点
    if (e.target.scrollTop > forwardCriticalPoint * this.rowHeight) {
      this.setRange(this.start + this.sectionSize)
    } else if (e.target.scrollTop < backCriticalPoint * this.rowHeight && this.start > 0) {
      this.setRange(this.start - this.sectionSize)
    }
    if (this.end + this.sectionSize > this.sectionSize * 4 * this.pageNo) {
      // 需要增加数据
      this.pageNo++
      this.pageChange()
    }
    this.emit('scroll', e.target.scrollTop)
  }
  update (top, trackHeight, totalHeight) {
    const scrollTopRatio = top / trackHeight
    const outScreenNum = Math.floor(scrollTopRatio * this.dataSize)
    const scrollTopSection = Math.floor(outScreenNum / this.sectionSize)
    const scrollTop = scrollTopRatio * totalHeight
    const offsetSection = scrollTopSection - 2
    if (offsetSection >= 0) {
      if (scrollTop > scrollTopSection * this.sectionSize * this.rowHeight) {
        this.setRange((offsetSection + 1) * this.sectionSize)
      }
    } else {
      this.setRange(0)
    }
    Promise.resolve().then(() => {
      this.container.scrollTop = scrollTop
      console.log(this.container.scrollTop, this.container, scrollTop, this.start);
    })
  }
  destroy () {
    this.container.removeEventListener('scroll', this.scrollHander.bind(this))
    emitter.all.clear()
  }
  // 监听滚动条
  listenScroll () {
    this.container.addEventListener('scroll', this.scrollHander.bind(this))
  }
  // 挂载之后初始化容器dom
  initContainerDom () {
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
  getAbsolutelType (position) {
    if (this.excludeKeys.includes(position)) return this.checkType.UNCHECKED
    if (this.includeKeys.includes(position)) return this.checkType.CHECKED
    if (position.indexOf('-') > 0) {
      const parentPos = position.replace(/(.*)(-\d+){1}/, "$1")
      return this.getAbsolutelType(parentPos)
    }
    return this.checkType.INDETERMINATE
  }
  getItemChcekType (position, isLeaf = false) {
    const absolutelType = this.getAbsolutelType(position)
    if (isLeaf) return absolutelType === this.checkType.CHECKED ? this.checkType.CHECKED : this.checkType.UNCHECKED
    if (absolutelType === this.checkType.CHECKED) {
      if (this.excludeKeys.some(e => e.startsWith(position))) return this.checkType.INDETERMINATE
      return this.checkType.CHECKED
    }
    if (absolutelType === this.checkType.UNCHECKED) {
      if (this.includeKeys.some(e => e.startsWith(position))) return this.checkType.INDETERMINATE
      return this.checkType.UNCHECKED
    }
    if (absolutelType === this.checkType.INDETERMINATE) {
      if (this.includeKeys.some(e => e.startsWith(position))) return this.checkType.INDETERMINATE
      return this.checkType.UNCHECKED
    }
  }
  check (position) {
    // 父级勾选 子集勾选取消
    this.includeKeys.forEach((e, index) => {
      if (e.startsWith(position) && e !== position) {
        this.includeKeys[index] = null
      }
    })
    // 父级勾选 子集排除取消
    this.excludeKeys.forEach((e, index) => {
      if (e.startsWith(position) && e !== position) {
        this.excludeKeys[index] = null
      }
    })
    this.includeKeys = this.includeKeys.filter(e => e !== null)
    this.excludeKeys = this.excludeKeys.filter(e => e !== null)

    if (this.excludeKeys.includes(position)) {
      this.excludeKeys.splice(this.excludeKeys.indexOf(position), 1)
    } else if (!this.includeKeys.includes(position)) {
      this.includeKeys.push(position)
    }
  }
  uncheck (position) {
    if (this.includeKeys.includes(position)) {
      this.includeKeys.splice(this.includeKeys.indexOf(position), 1)
    } else {
      this.excludeKeys.push(position)
    }
  }
}
