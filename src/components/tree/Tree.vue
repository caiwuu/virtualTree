<template>
  <div>
    <div ref="zgTree" :class="{ 'zg-tree': true, 'is-active': item.active }" v-for="(item, index) in list"
      :key="item.position" :style="{
        paddingLeft: item.level * levelIndent + 'px',
        lineHeight: (rowHeight > 20 ? rowHeight - 2 : rowHeight) + 'px',
        height: rowHeight + 'px',
      }" @click="collapseChange(item, index)">
      <div class="zg-triangle">
        <div class="zg-triangle-right" v-if="item.collapsed && !item.isLeaf"></div>
        <div class="zg-triangle-bottom" v-if="!item.collapsed && !item.isLeaf"></div>
      </div>
      <label class="zg-checkbox" v-if="showCheckbox" @click.stop="selectChange(item, index)">
        <span :class="{
          'zg-checkbox__input': true,
          'is-indeterminate': item.checkType === 1,
          'is-checked': item.checkType === 2,
        }">
          <span class="zg-checkbox__inner" :style="{ backgroundColor: checkboxBg, borderColor: checkboxBg }"></span>
        </span>
      </label>
      <div class="zg-content">
        <slot :row="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-tree',
  props: {
    levelIndent: {
      type: [Number],
      default: 20,
    },
    showCheckbox: {
      type: [Boolean],
      default: true,
    },
    rowHeight: {
      type: [Number],
      default: 36,
    },
    checkOnClickNode: {
      type: [Boolean],
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    checkboxBg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedMap: {},
      selectList: [],
      currectClickItem: {},
      checkType: Object.freeze({
        UNCHECKED: 0,
        INDETERMINATE: 1,
        CHECKED: 2,
      }),
    }
  },
  computed: {
    list() {
      return this.data
    },
  },
  watch: {
    defaultCheckedKeys() {
      this.setDefaultCheckedKeys()
    },
    list() {
      this.setSelect()
      this.setLineActive()
    },
  },
  mounted() {
    this.setDefaultCheckedKeys()
  },
  methods: {
    /**
     * ??????????????????
     */
    getSelect() {
      return this.selectList
    },
    /**
     * ????????????
     */
    setSelect() {
      if (this.selectList.length === 0) {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].checkType = this.checkType.UNCHECKED
        }
      }
      this.selectList.forEach((id) => {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id + '' === id + '') {
            this.list[i].checkType = this.checkType.CHECKED
          }
        }
      })
    },
    /**
     * ??????????????????
     * @param item node
     */
    setSelectList(id) {
      let index = this.selectList.findIndex((e) => id + '' === e.id + '')
      if (index !== -1) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(id)
      }
    },
    /**
     * ????????????????????????
     * @param item node
     */
    setDefaultCheckedKeys() {
      this.setNoSelectAll()
      this.defaultCheckedKeys.forEach((id) => {
        this.setSelectList(id)
      })
      this.setSelect()
    },
    /**
     * ??????????????????
     */
    setNoSelectAll() {
      console.log(12312)
      this.selectList = []
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].checkType = this.checkType.UNCHECKED
      }
    },
    /**
     * tree???????????????
     * @param id
     * @param index
     */
    collapseChange(item, index) {
      if (!item.isLeaf) {
        item.collapsed = !item.collapsed
        this.$emit('collapseChange', item, index)
      }
      this.list.forEach((e) => (e.active = false))
      this.currectClickItem = item
      this.setLineActive()
      this.$emit('nodeClick', item)
    },
    /**
     * ?????????????????????
     * @param item
     */
    setLineActive() {
      if (this.currectClickItem) {
        this.list.forEach((e) => (e.active = false))
        this.currectClickItem.active = true
      }
    },
    /**
     * ???????????????map??????
     * @param item
     */
    createSelectMap(item) {
      let map = this.selectedMap
      let node = this.selectedMap[item.id]
      Object.keys(map).forEach((key) => {
        let mapIndex = -1
        let has = map[key].exclude.find((e, i) => {
          let state = item.id === e.id
          if (state) {
            mapIndex = i
          }
          return state
        })
        if (has) {
          map.exclude.splice(mapIndex, 1)
        }
      })
      // ??????????????????key?????????????????????????????????????????????key????????????exclude
      if (node) {
        let childCount = node.exclude.find((e) => item.id + '' === e.pid + '')
        if (childCount?.length === node.childCount) {
          node.exclude = []
        } else {
          delete this.selectedMap[item.id]
        }
      }
      if (!node) {
        let arr = item.position.split('-')
        let state = true
        for (let i = 0; i < arr.length - 1; i++) {
          let map = this.selectedMap[parseInt(arr[i])]
          if (map) {
            state = false
            let mapIndex = -1
            let has = map.exclude.find((e, i) => {
              let state = item.id === e.id
              if (state) {
                mapIndex = i
              }
              return state
            })
            if (!has) {
              map.exclude.push(item)
            } else {
              map.exclude.splice(mapIndex, 1)
            }
            break
          }
        }
        if (state) {
          this.selectedMap[item.id] = {
            node: item,
            exclude: [],
          }
        }
      }
    },
    /**
     * ??????????????????
     * @param item
     */
    noCheckParents(item) {
      let nodeList = this.list.filter((e) => {
        return (
          item.pid === e.pid &&
          e.checkType !== this.checkType.INDETERMINATE &&
          e.checkType !== this.checkType.CHECKED
        )
      })
      let pNode = this.list.find((e) => {
        return item.pid + '' === e.id + ''
      })
      if (pNode && pNode.childCount) {
        if (pNode.childCount === nodeList.length) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id === pNode.id && item.level !== 0) {
              this.list[i].checkType = this.checkType.UNCHECKED
              this.noCheckParents(this.list[i])
              break
            }
          }
        } else {
          let arr = item.position.split('-')
          console.log(arr)
          if (arr.length > 1) {
            for (let i = 0; i < arr.length - 1; i++) {
              for (let j = 0; j < this.list.length; j++) {
                console.log(arr[i], this.list[j].id + '', arr[i] + '' === this.list[j].id + '')
                if (arr[i] + '' === this.list[j].id + '' && item.level !== 0) {
                  this.list[j].checkType = this.checkType.INDETERMINATE
                  break
                }
              }
            }
          }
        }
      }
    },
    /**
     * ????????????
     * @param item
     */
    checkParents(item) {
      let nodeList = this.list.filter((e) => {
        return item.pid === e.pid && e.checkType === this.checkType.CHECKED
      })
      let pNode = this.list.find((e) => {
        return item.pid + '' === e.id + ''
      })
      if (pNode && pNode.childCount) {
        if (pNode.childCount === nodeList.length) {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id === pNode.id && item.level !== 0) {
              this.list[i].checkType = this.checkType.CHECKED
              this.checkParents(this.list[i])
              break
            }
          }
        } else {
          let arr = item.position.split('-')
          if (arr.length > 1) {
            for (let i = 0; i < arr.length - 1; i++) {
              for (let j = 0; j < this.list.length; j++) {
                if (arr[i] + '' === this.list[j].id + '' && item.level !== 0) {
                  this.list[j].checkType = this.checkType.INDETERMINATE
                  break
                }
              }
            }
          }
        }
      }
    },
    /**
     * ????????????
     * @param item
     * @param checkType
     */
    checkChild(item, checkType, data) {
      for (let i = 0; i < data.length; i++) {
        if (item.level < data[i].level) {
          if (data[i].position.slice(0, item.position.length + 1) === item.position + '-') {
            data[i].checkType = checkType
          }
        }
      }
    },
    /**
     * ??????selectMap??????
     * @param map
     */
    checkBySelectedMap(map, data) {
      Object.keys(map).forEach((key) => {
        for (let i = 0; i < data.length; i++) {
          if (key + '' === data[i].id + '') {
            data[i].checkType = this.checkType.CHECKED
            this.checkParents(map[key].node)
            this.checkChild(data[i], this.checkType.CHECKED, data)
          }
        }
        if (map[key].exclude.length !== 0) {
          map[key].exclude.forEach((e) => {
            for (let i = 0; i < data.length; i++) {
              if (e.id + '' === data[i].id + '') {
                data[i].checkType = this.checkType.UNCHECKED
                this.noCheckParents(e)
                this.checkChild(data[i], this.checkType.UNCHECKED, data)
              }
            }
          })
        }
      })
    },
    /**
     * ???????????????????????????
     * @param item
     */
    selectByClick(item) {
      switch (item.checkType) {
        case 0:
          item.checkType = this.checkType.CHECKED
          this.checkParents(item)
          this.checkChild(item, this.checkType.CHECKED, this.list)
          break
        case 1:
          item.checkType = this.checkType.CHECKED
          this.checkParents(item)
          this.checkChild(item, this.checkType.CHECKED, this.list)
          break
        case 2:
          item.checkType = this.checkType.UNCHECKED
          this.noCheckParents(item)
          this.checkChild(item, this.checkType.UNCHECKED, this.list)
          break
        default:
          item.checkType = this.checkType.CHECKED
          this.checkParents(item)
          this.checkChild(item, this.checkType.CHECKED, this.list)
          break
      }
    },
    /**
     * check????????????
     * @param item
     */
    selectChange(item) {
      if (this.checkOnClickNode) {
        let index = this.selectList.findIndex((id) => item.id + '' === id + '')
        if (index !== -1) {
          this.selectList.splice(index, 1)
        } else {
          this.selectList.push(item.id)
        }
        if (this.selectList.length === 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].checkType = this.checkType.UNCHECKED
          }
        } else {
          this.selectList.forEach((id) => {
            let node = this.list.find((e) => e.id + '' === id + '')
            if (node) {
              switch (node.checkType) {
                case 0:
                  item.checkType = this.checkType.CHECKED
                  break
                case 1:
                  item.checkType = this.checkType.CHECKED
                  break
                case 2:
                  item.checkType = this.checkType.UNCHECKED
                  break
                default:
                  item.checkType = this.checkType.CHECKED
                  break
              }
            }
          })
        }
        this.$emit('selectChange', this.selectList)
      } else {
        let index = this.selectList.findIndex((e) => item.id + '' === e.id + '')
        if (index !== -1) {
          this.selectList.splice(index, 1)
        } else {
          this.selectList.push(item)
        }
        if (this.selectList.length === 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].checkType = this.checkType.UNCHECKED
          }
        } else {
          this.selectList.forEach((e) => {
            console.log(e.checkType)
            this.selectByClick(e)
          })
        }
        this.$emit('selectChange', this.selectList)
      }
    },
  },
}
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.zg-tree {
  width: 100%;
  height: 26px;
  line-height: 26px;
  box-sizing: border-box;
  user-select: none;
}

.zg-content {
  display: inline-block;
  vertical-align: middle;
}

.zg-triangle {
  width: 20px;
  height: 26px;
  line-height: 24px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}

.zg-triangle-right {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 6px solid #c0c4cc;
  border-right: 0 solid transparent;
  border-bottom: 4px solid transparent;
}

.zg-triangle-bottom {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 6px solid #c0c4cc;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 0 solid transparent;
}

.zg-checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;
  margin-right: 8px;
}

.zg-checkbox__input {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
}

.zg-checkbox__inner {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #fff;
  z-index: 1;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}

.zg-checkbox__inner:after {
  box-sizing: content-box;
  content: '';
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 8px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
}

.zg-checkbox__input.is-checked .zg-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}

.zg-checkbox__input.is-checked .zg-checkbox__inner:after {
  transform: rotate(45deg) scaleY(1);
}

.zg-checkbox__input.is-indeterminate .zg-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}

.zg-checkbox__input.is-indeterminate .zg-checkbox__inner:before {
  content: '';
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(0.5);
  left: 0;
  right: 0;
  top: 5px;
}

.zg-tree:hover,
.zg-tree:focus,
.zg-tree:active {
  background-color: #f5f7fa;
}

.is-active {
  background-color: #f5f7fa;
}
</style>
