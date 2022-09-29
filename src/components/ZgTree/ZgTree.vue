<template>
  <div>
    <div class="zg-tree"
         v-for="(item,index) in list"
         :key="index"
         :style="{
             paddingLeft: (item.level * levelDistance)+'px',
             height: itemHeight + 'px'
           }"
         @click="collapseChange(item,index)">
      <div class="zg-triangle">
        <div class="zg-triangle-right" v-if="item.collapsed && !item.isLeaf"></div>
        <div class="zg-triangle-bottom" v-if="!item.collapsed && !item.isLeaf"></div>
      </div>
      <label class="zg-checkbox"
             v-if="showCheckbox"
             @click.stop="selectChange(item,index)"
      >
        <span :class="{
          'zg-checkbox__input': true,
          'is-indeterminate': item.checkType === 1,
          'is-checked': item.checkType === 2
        }">
          <span class="zg-checkbox__inner"></span>
        </span>
      </label>
      <div class="zg-content">
        {{item.name}}
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
      default: 10
    },
    showCheckbox: {
      type: [Boolean],
      default: true
    },
    itemHeight: {
      type: [Number],
      default: 26
    },
    currentNodeKey: {
      type: [Number],
      default: 10
    },
    defaultCheckedKeys: {
      type: [Number],
      default: 10
    },
    checkStrictly: {
      type: [Number],
      default: 10
    },
    checkOnClickNode: {
      type: [Number],
      default: 10,
    },
    sourceData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedData: []
    };
  },
  computed: {
    list() {
      return this.sourceData
    }
  },
  created() {
  },
  methods: {
    /**
     * 获取孩子是否存在
     * @param id
     * @returns {boolean}
     */
    hasChild(id) {
      return this.data.some(e => id === e.pid)
    },
    /**
     * tree行点击事件
     * @param id
     * @param index
     */
    collapseChange(item, index) {
      item.collapsed = !item.collapsed
      this.$emit('collapseChange')
    },
    /**
     * tree行点击事件
     * @param level
     * @param id
     * @param pid
     * @returns {boolean}
     */
    checkAll({ level, id, pid }) {
      this.data.forEach((e, i) => {
        if (id !== e.id) {
          if (e.level > level && e.pid === id) {
            e.checkType = 2;
            if (!e.isLeaf) {
              this.checkAll({ level: ++level, id: e.id, pid: e.pid })
            }
          }
        }
      })
    },
    /**
     * check选中事件
     * @param item
     * @param index
     */
    selectChange(item, index) {
      const type = {
        0: () => {
          item.checkType = 2;

        },
        1: () => {
          item.checkType = 2;
        },
        2: () => {
          item.checkType = 0;
        }
      }
      if(!type[item.checkType]){
        item.checkType = 2;
      } else {
        type[item.checkType]();
      }
      this.$emit('selectChange')
    },
  },
};
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
  transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
}

.zg-checkbox__inner:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 8px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform .15s ease-in .05s;
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
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(.5);
  left: 0;
  right: 0;
  top: 5px;
}
</style>
