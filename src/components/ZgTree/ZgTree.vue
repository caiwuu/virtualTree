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
      selectedMap: {},
      checkType:Object.freeze({
        UNCHECKED:0,
        INDETERMINATE:1,
        CHECKED:2
      })
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
            e.checkType = this.checkType.CHECKED;
            if (!e.isLeaf) {
              this.checkAll({ level: ++level, id: e.id, pid: e.pid })
            }
          }
        }
      })
    },
    /**
     * 生成选中的map数据
     * @param item
     */
    createSelectMap(item) {
      if(this.selectedMap[item.id]){
        delete this.selectedMap[item.id]
      } else {
        for (const itemElement in this.selectedMap) {
          if(this.selectedMap[itemElement].node.level > item.level && this.selectedMap[itemElement].node.position.slice(0,item.position.length + 1) === item.position + '-'){
            delete this.selectedMap[itemElement];
          }
        }
        let arr = item.position.split('-');
        let state = true;
        for (let i = 0; i < arr.length-1; i++) {
          let map = this.selectedMap[parseInt(arr[i])];
          if(map){
            state = false;
            let mapIndex = -1;
            let has = map.exclude.find((e,i) => {
              if(e.id === item.id){
                mapIndex = i;
              }
              return e.id === item.id
            });
            if(!has){
              map.exclude.push(item);
            } else {
              map.exclude.splice(mapIndex, 1);
            }
            break;
          }
        }
        if(state){
          this.selectedMap[item.id] = {
            node: item,
            exclude: []
          };
        }
      }
    },
    /**
     * 取消选中上级
     * @param item
     */
    noCheckParents(item) {
      let nodeList = this.sourceData.filter((e) => {
        return item.pid === e.pid && e.checkType !== this.checkType.INDETERMINATE && e.checkType !== this.checkType.CHECKED;
      });
      let pNode = this.sourceData.find((e) => {
        return item.pid + '' === e.id + '';
      });
      if(pNode && pNode.childCount) {
        if(pNode.childCount === nodeList.length) {
          for (let i = 0; i < this.sourceData.length; i++) {
            if(this.sourceData[i].id === pNode.id && item.level !== 0) {
              this.sourceData[i].checkType = this.checkType.UNCHECKED;
              this.noCheckParents(this.sourceData[i]);
              break;
            }
          }
        } else {
          let arr = item.position.split('-');
          console.log(arr)
          if(arr.length > 1){
            for (let i = 0; i < arr.length - 1 ; i++) {
              for (let j = 0; j < this.sourceData.length; j++) {
                console.log(arr[i],this.sourceData[j].id + '',arr[i] + '' === this.sourceData[j].id + '')
                if(arr[i] + '' === this.sourceData[j].id + '' && item.level !== 0) {
                  this.sourceData[j].checkType = this.checkType.INDETERMINATE;
                  break;
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
      let nodeList = this.sourceData.filter((e) => {
        return item.pid === e.pid && e.checkType === this.checkType.CHECKED;
      });
      let pNode = this.sourceData.find((e) => {
        return item.pid + '' === e.id + '';
      });
      if(pNode && pNode.childCount) {
        if(pNode.childCount === nodeList.length) {
          for (let i = 0; i < this.sourceData.length; i++) {
            if(this.sourceData[i].id === pNode.id && item.level !== 0) {
              this.sourceData[i].checkType = this.checkType.CHECKED;
              this.checkParents(this.sourceData[i]);
              break;
            }
          }
        } else {
          let arr = item.position.split('-');
          if(arr.length > 1){
            for (let i = 0; i < arr.length - 1 ; i++) {
              for (let j = 0; j < this.sourceData.length; j++) {
                if(arr[i] + '' === this.sourceData[j].id + '' && item.level !== 0) {
                  this.sourceData[j].checkType = this.checkType.INDETERMINATE;
                  break;
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
        if(item.level < sourceData[i].level){
          if(sourceData[i].position.slice(0,item.position.length + 1) === item.position + '-') {
            sourceData[i].checkType = checkType;
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
        console.log(map[key])
        if(map[key].exclude.length === 0) {
          for (let i = 0; i < sourceData.length; i++) {
            if(key + '' === sourceData[i].id + ''){
              sourceData[i].checkType = this.checkType.CHECKED;
              this.checkChild(sourceData[i], this.checkType.CHECKED, sourceData);
              this.checkParents(map[key].node);
              continue;
            }
          }
        }
        if(map[key].exclude.length !== 0 ) {
          if(map[key].node.childCount === map[key].exclude.length) {
            for (let i = 0; i < sourceData.length; i++) {
              if(key + '' === sourceData[i].id + ''){
                sourceData[i].checkType = this.checkType.UNCHECKED;
                this.checkChild(sourceData[i], this.checkType.UNCHECKED, sourceData);
                this.noCheckParents(map[key].node);
                continue;
              }
            }
          }
          if(map[key].node.childCount !== map[key].exclude.length) {
            for (let i = 0; i < sourceData.length; i++) {
              if(key + '' === sourceData[i].id + ''){
                sourceData[i].checkType = this.checkType.INDETERMINATE;
                this.checkChild(sourceData[i], this.checkType.INDETERMINATE, sourceData);
                this.checkParents(map[key].node);
                continue;
              }
            }
          }
        }
        // this.checkType = this.checkType.UNCHECKED;
      })

    },
    /**
     * 根据当前点击项选中
     * @param item
     * @param index
     */
    selectByClick(item) {
      if(item.checkType){
        switch (item.checkType) {
          case 0:
            item.checkType = this.checkType.CHECKED;
            this.checkChild(item, this.checkType.CHECKED, this.sourceData);
            this.checkParents(item);
            break;
          case 1:
            item.checkType = this.checkType.CHECKED;
            this.checkChild(item, this.checkType.CHECKED, this.sourceData);
            this.checkParents(item);
            break;
          case 2:
            item.checkType = this.checkType.UNCHECKED;
            this.checkChild(item, this.checkType.UNCHECKED, this.sourceData);
            this.noCheckParents(item)
            break;
          default :
            break;
        }
      } else {
        item.checkType = this.checkType.CHECKED;
        this.checkChild(item, 2, this.sourceData);
        this.checkParents(item);
        return false;
      }
    },
    /**
     * check选中事件
     * @param item
     * @param index
     */
    selectChange(item, index) {
      this.createSelectMap(item);
      console.log(this.selectedMap)
      // this.checkBySelectedMap(this.selectedMap, this.sourceData);
      this.selectByClick(item);
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
