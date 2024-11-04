<template>
  <div>
    <div ref="VTreeItems" :class="{ 'v-tree-items': true, 'is-active': item.active }" v-for="(item, index) in list"
      :key="item.position" :style="{
        paddingLeft: item.level * levelIndent + 'px',
        lineHeight: (rowHeight > 20 ? rowHeight - 2 : rowHeight) + 'px',
        height: rowHeight + 'px',
      }" @click="collapseChange(item, index)">
      <div class="triangle">
        <div class="triangle-right" v-if="item.collapsed && !item.isLeaf"></div>
        <div class="triangle-bottom" v-if="!item.collapsed && !item.isLeaf"></div>
      </div>
      <label class="checkbox" v-if="showCheckbox" @click.stop="toggleSelect(item, index)">
        <span :class="checkClass(item)">
          <span class="checkbox__inner" :style="{ backgroundColor: checkboxBg, borderColor: checkboxBg }"></span>
        </span>
      </label>
      <div class="content">
        <slot :row="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script>
const checkType = {
  UNCHECKED: 0,
  INDETERMINATE: 1,
  CHECKED: 2,
}
export default {
  name: 'VTreeItems',
  props: {
    ve: {
      type: Object,
      default: () => { },
    },
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
    checkStrictly: {
      type: [Boolean],
      default: false,
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
  data () {
    return {
      selectedMap: {},
      selectList: [],
    }
  },
  computed: {
    list () {
      return this.data
    },
  },
  watch: {
    defaultCheckedKeys () {
      this.setDefaultCheckedKeys()
    }
  },
  mounted () {
    this.setDefaultCheckedKeys()
  },
  methods: {
    checkClass (item) {
      const checkType = this.ve.getItemChcekType(item.position, item.isLeaf)
      item.checkType = checkType
      return {
        'checkbox__input': true,
        'is-indeterminate': checkType === 1,
        'is-checked': checkType === 2,
      }
    },

    /**
     * 获取当前选项
     */
    getSelect () {
      return {
        includeKeys: this.ve.includeKeys,
        excludeKeys: this.ve.excludeKeys,
      }
    },
    /**
     * 设置选中
     */
    setSelect (position = "0-0-0") {
      // eslint-disable-next-line vue/no-mutating-props
      this.ve.includeKeys.push(position)
    },
    /**
     * 设置选中列表
     * @param item node
     */
    setSelectList (id) {
      let index = this.selectList.findIndex((e) => id + '' === e.id + '')
      if (index !== -1) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(id)
      }
    },
    /**
     * 设置默认选中列表
     * @param item node
     */
    setDefaultCheckedKeys () {
      this.setNoSelectAll()
      this.defaultCheckedKeys.forEach((position) => {
        this.ve.check(position)
      })
    },
    /**
     * 获取当前选项
     */
    setNoSelectAll () {
      // eslint-disable-next-line vue/no-mutating-props
      this.ve.includeKeys.length = 0
      // eslint-disable-next-line vue/no-mutating-props
      this.ve.excludeKeys.length = 0

    },
    /**
     * tree行点击事件
     * @param id
     * @param index
     */
    collapseChange (item, index) {
      if (!item.isLeaf) {
        this.$emit('collapseChange', item, index)
      }
      if (this.checkOnClickNode && item.isLeaf) {
        this.toggleSelect(item, index)
      }
      this.list.forEach((e) => (e.active = false))
      this.setLineActive(item)
      this.$emit('nodeClick', item)
    },
    /**
     * 设置行点击选中
     * @param item
     */
    setLineActive (item) {
      this.list.forEach((e) => (e.active = false))
      item.active = true
    },
    /**
     * 根据当前点击项选中
     * @param item
     */
    toggleCheckType (item) {
      item.checkType === checkType.CHECKED ? this.ve.uncheck(item.position) : this.ve.check(item.position)
    },
    /**
     * check选中事件
     * @param item
     */
    toggleSelect (item) {
      this.toggleCheckType(item)
      this.$emit('toggleSelect', this.getSelect())
    }
  }
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

.v-tree-items {
  width: 100%;
  height: 26px;
  line-height: 26px;
  box-sizing: border-box;
  user-select: none;
}

.content {
  display: inline-block;
  vertical-align: middle;
}

.triangle {
  width: 20px;
  height: 26px;
  line-height: 24px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}

.triangle-right {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 6px solid #c0c4cc;
  border-right: 0 solid transparent;
  border-bottom: 4px solid transparent;
}

.triangle-bottom {
  vertical-align: middle;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 6px solid #c0c4cc;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 0 solid transparent;
}

.checkbox {
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

.checkbox__input {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
}

.checkbox__inner {
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

.checkbox__inner:after {
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

.checkbox__input.is-checked .checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}

.checkbox__input.is-checked .checkbox__inner:after {
  transform: rotate(45deg) scaleY(1);
}

.checkbox__input.is-indeterminate .checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}

.checkbox__input.is-indeterminate .checkbox__inner:before {
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

.v-tree-items:hover,
.v-tree-items:focus,
.v-tree-items:active {
  background-color: #f5f7fa;
}

.is-active {
  background-color: #f5f7fa;
}
</style>
