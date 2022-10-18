<template>
  <div>
    <div class="zg-tree" v-for="(item, index) in list" :key="item.position" :style="{
      paddingLeft: item.level * levelDistance + 'px',
      height: itemHeight + 'px',
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
          <span class="zg-checkbox__inner"></span>
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
  components: {},
  props: {
    levelDistance: {
      type: [Number],
      default: 10,
    },
    showCheckbox: {
      type: [Boolean],
      default: true,
    },
    itemHeight: {
      type: [Number],
      default: 26,
    },
    checkOnClickNode: {
      type: [Boolean],
      default: false,
    },
    sourceData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedMap: {},
      selectList: [],
      checkType: Object.freeze({
        UNCHECKED: 0,
        INDETERMINATE: 1,
        CHECKED: 2,
      }),
    }
  },
  computed: {
    list() {
      return this.sourceData
    },
  },
  methods: {
    /**
     * 获取孩子是否存在
     * @param id
     * @returns {boolean}
     */
    hasChild(id) {
      return this.data.some((e) => id === e.pid)
    },
    /**
     * tree行点击事件
     * @param id
     * @param index
     */
    collapseChange(item, index) {
      item.collapsed = !item.collapsed
      this.$emit('collapseChange', item, index)
    },
    /**
     * 生成选中的map数据
     * @param item
     */
    createSelectMap(item) {
      let map = this.selectedMap;
      let node = this.selectedMap[item.id];
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
      // 如果存在当前key并且如果孩子数量满了则删除当前key否则清空exclude
      if (node) {
        let childCount = node.exclude.find(e => item.id + '' === e.pid + '');
        if (childCount?.length === node.childCount) {
          node.exclude = [];
        } else {
          delete this.selectedMap[item.id];
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

      // 如果不存在当前key当时
      // for (const itemElement in this.selectedMap) {
      //   if (
      //       this.selectedMap[itemElement].node.level > item.level &&
      //       this.selectedMap[itemElement].node.position.slice(0, item.position.length + 1) ===
      //       item.position + '-'
      //   ) {
      //     delete this.selectedMap[itemElement]
      //   }
      // }

    },
    /**
     * 取消选中上级
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
                console.log(
                  arr[i],
                  this.list[j].id + '',
                  arr[i] + '' === this.list[j].id + ''
                )
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
     * 选中上级
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
     * 选中孩子
     * @param item
     * @param checkType
     */
    checkChild(item, checkType, sourceData) {
      for (let i = 0; i < sourceData.length; i++) {
        if (item.level < sourceData[i].level) {
          if (sourceData[i].position.slice(0, item.position.length + 1) === item.position + '-') {
            sourceData[i].checkType = checkType
          }
        }
      }
    },
    /**
     * 根据selectMap选中
     * @param map
     */
    checkBySelectedMap(map, sourceData) {
      Object.keys(map).forEach((key) => {
        for (let i = 0; i < sourceData.length; i++) {
          if (key + '' === sourceData[i].id + '') {
            sourceData[i].checkType = this.checkType.CHECKED
            this.checkParents(map[key].node)
            this.checkChild(sourceData[i], this.checkType.CHECKED, sourceData)
          }
        }
        if (map[key].exclude.length !== 0) {
          map[key].exclude.forEach((e) => {
            for (let i = 0; i < sourceData.length; i++) {
              if (e.id + '' === sourceData[i].id + '') {
                sourceData[i].checkType = this.checkType.UNCHECKED
                this.noCheckParents(e)
                this.checkChild(sourceData[i], this.checkType.UNCHECKED, sourceData)
              }
            }
          })
        }
      })
    },
    /**
     * 根据当前点击项选中
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
          break
      }
    },
    /**
     * check选中事件
     * @param item
     */
    selectChange(item) {
      if (this.checkOnClickNode) {
        let index = this.selectList.findIndex(e => item.id + '' === e.id + '')
        if (index !== -1) {
          this.selectList.splice(index, 1);
        } else {
          this.selectList.push(item)
        }
        console.log(this.selectList)
        if (this.selectList.length === 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].checkType = this.checkType.UNCHECKED
          }
          console.log(this.list)
        } else {
          this.selectList.forEach((e) => {
            switch (e.checkType) {
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
          })
        }
        console.log(this.selectList);
        this.$emit('selectChange', this.selectList)
      } else {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].checkType = this.checkType.UNCHECKED
        }
        this.createSelectMap(item)
        console.log(this.selectedMap)
        this.checkBySelectedMap(this.selectedMap, this.list)
        // this.selectByClick(item);
        this.$emit('selectChange', this.selectedMap)
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
  width: 200px;
  height: 26px;
  line-height: 26px;
  user-select: none;
}

.zg-content {
  display: inline-block;
  vertical-align: middle;
}

.zg-triangle {
  width: 20px;
  height: 26px;
  line-height: 26px;
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
</style>
