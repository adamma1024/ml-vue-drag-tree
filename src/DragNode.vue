<template>
  <div :style='styleObj' 
  :draggable='isDraggable' 
  @drag.stop='drag'
  @dragstart.stop='dragStart' 
  @dragover.stop='dragOver' 
  @drop.stop='drop' 
  @dragend.stop='dragEnd' 
  class='dnd-container'>
    <div :class='{"menu-item-active": isActived,
    "menu-item-active-before": isActived,
    "ivu-menu-item-hover":isHover,
    "child-hover": isDragChildHover,
    "top-hover": isDragTopHover,
    "bottom-hover": isDragBottomHover, 
    "ivu-menu-item tree-node-div": true}' 
    @click="toggle"
    @mouseenter='mouseEnter' 
    @mouseleave='mouseLeave'>
      <div
        :class='{"ml-drag-top-div": true, "menu-item-active": isActived}' 
        @dragenter.stop='dragEnterTop' 
        @dragleave.stop='dragLeaveTop'>
      </div>
      <div 
      :style="{ 'padding-left': (this.depth - 1) * 14 + 'px' }" 
      :class='{"ml-drag-content-div": true, "ml-drag-content": true, "menu-item-active": isActived, "ivu-menu-item-hover":isHover}'
      @dragenter.stop='dragEnterChild' 
      @dragleave.stop='dragLeaveChild'>
        <div 
        :class='{"node-icon-div ml-drag-content": true, "ivu-menu-item-hover":isHover}'>
          <slot name="node-icon" :node="model">
            <Icon :type="model.icon"></Icon>
          </slot>
        </div>
        <div 
        :class='{"node-text-div ml-drag-content": true, "ivu-menu-item-hover":isHover}'>
          <slot name="node-text" :node="model">
            <Tooltip :content="model.title" 
            placement="top-start"
            max-width="200" 
            :delay="1000" transfer theme="light" :disabled="shortText(model.title, this.maxCharNum) === false">
              <span class='text'>{{formatText(model.title)}}</span>
            </Tooltip>
          </slot>
        </div>
        <Icon :class="[isOpened ? 'nodeClicked' : '','vue-drag-node-icon']" type="ios-arrow-down" v-if="showDropDownIcon()"></Icon>
      </div>
      <div
        :class='{"ml-drag-bottom-div": true, "menu-item-active": isActived}' 
        @dragenter.stop='dragEnterBottom' 
        @dragleave.stop='dragLeaveBottom'>
      </div>
    </div>
    <div class='treeMargin open' v-show="isOpened" v-if="isFolder">
      <drag-node v-for="item2 in model.children"
      :allowDrag='allowDrag'
      :allowDrop='allowDrop'
      :model="item2"
      :key='item2.id'
      :dragging='dragging'
      :depth='increaseDepth'
      :open-names='openNames'
      :active-name='activeName'
      :max-char-num="maxCharNum"
      @menuitem-mouse-in="onMouseIn"
      @menuitem-mouse-leave="onMouseLeave"
      @on-node-click='onNodeClick'>
        <template v-slot:node-icon="slotProps">
          <slot name="node-icon" :node="slotProps.node"></slot>
        </template>
        <template v-slot:node-text="slotProps">
          <slot name="node-text" :node="slotProps.node"></slot>
        </template>
      </drag-node>
    </div>
  </div>
</template>

<script>
let id = 1000
let fromData = null
let toData = null
let rootTree = null // vue-drag-tree组件引用

import { findRoot, exchangeData, shortText } from './util'
export default {
  name: 'DragNode',
  data () {
    return {
      isHover: false, // 当前节点被hvoer
      isDragTopHover: false,
      isDragBottomHover: false,
      isDragChildHover: false,
      styleObj: {
        opacity: 1
      }
    }
  },
  props: {
    model: Object,
    allowDrag: {
      type: Function,
      default: () => true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    openNames: {
      type: Array,
      default: () => []
    },
    activeName: {
      type: String,
      default: ''
    },
    depth: {
      type: Number,
      default: 0
    },
    dragging: {
      type: Boolean,
      default: false
    },
    maxCharNum: {
      type: Number,
      default: 6
    }
  },
  computed: {
    isFolder () {
      return this.model.children && this.model.children.length
    },
    increaseDepth () {
      return this.depth + 1
    },
    isDraggable () {
      return this.allowDrag(this.model, this)
    },
    isOpened () {
      return this.openNames.indexOf(this.model.id) > -1
    },
    isActived () {
      return this.activeName === this.model.id
    }
  },
  watch: {
    dragging (val) {
      if (!val) {
        this.isDragChildHover = false
        this.isDragTopHover = false
        this.isDragBottomHover = false
      }
    }
  },
  methods: {
    shortText,
    formatText(text){
      let t = shortText(text, this.maxCharNum)
      return t ? t : text
    },
    showDropDownIcon () {
      if (this.model.children) {
        return true
      } else {
        if (this.isOpened) {
          // 关闭打开状态
          this.onNodeClick(this.model.id)
        }
        return false
      }
    },
    toggle () {
      // 调用vue-drag-tree的父组件中的方法,以传递出当前被点击的节点的id值
      //　API: 对外开放的当前被点击节点的信息
      rootTree.emitCurNodeClicked(this.model, this)

      if(this.model.children){
        // 通过id记录展开状态
        this.onNodeClick(this.model.id)
      }
    },
    mouseEnter (e) {
      if (!this.dragging) {
        let id = this.model.id
        this.isHover = true
        this.onMouseIn(e)
        e.stopPropagation()
      }
    },
    mouseLeave (e) {
      if (!this.dragging) {
        let id = this.model.id
        this.isHover = false
        this.onMouseLeave(e)
        e.stopPropagation()
      }
    },
    dragEnterChild (e) {
      this.isDragChildHover = true
    },
    dragLeaveChild (e) {
      this.isDragChildHover = false
    },
    dragEnterBottom (e) {
      this.isDragBottomHover = true
    },
    dragLeaveBottom (e) {
      this.isDragBottomHover = false
    },
    dragEnterTop (e) {
      this.isDragTopHover = true
    },
    dragLeaveTop (e) {
      this.isDragTopHover = false
    },
    onMouseIn(e){
      let id = this.model.id
      rootTree.menuItemMouseIn({e, id})
    },
    onMouseLeave(e){
      let id = this.model.id
      rootTree.menuItemMouseLeave({e, id})
    },
    removeChild (id) {
      // 获取父组件的model.children
      let parent_model_children = this.$parent.model.children

      // 在父组件model.children里删除
      for (let index in parent_model_children) {
        // 找到该删的id
        if (parent_model_children[index].id === id) {
          parent_model_children = parent_model_children.splice(index, 1)
          break
        }
      }
    },
    drag (e) {
      fromData = this
      rootTree.emitDrag(this.model, this, e)
    },
    dragStart (e) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', 'asdad')
      return true
    },
    dragOver (e) {
      e.preventDefault()
      rootTree.emitDragOver(this.model, this, e)
      return true
    },
    dragEnter (e) {
      if (this._uid !== fromData._uid) {
        this.styleObj.opacity = 0.5
      }
      rootTree.emitDragEnter(this.model, this, e)
    },
    dragLeave (e) {
      this.styleObj.opacity = 1
      rootTree.emitDragLeave(this.model, this, e)
    },
    drop (e) {
      e.preventDefault()
      this.styleObj.opacity = 1
      rootTree.emitDrop(this.model, this, e)
      // 如果判断当前节点不允许被drop，return;
      if (!this.allowDrop(this.model, this)) {
        return
      }
      toData = this
      exchangeData(fromData, toData, e)
    },
    dragEnd (e) {
      rootTree.emitDragEnd(this.model, this, e)
      return
    },
    onNodeClick (id) {
      this.$emit('on-node-click', id)
    }
  },
  created () {
    rootTree = findRoot(this)
  }
}
</script>

<style scoped>
.dnd-container {
  background: #fff;
}

.dnd-container .is-clicked {
  background: rgba(244,246,248,1);
}

.dnd-container .is-hover {
  background: rgba(249,249,249,1);
}

.item {
  cursor: pointer;
}

.bold {
  font-weight: bold;
}

.menu-item-active{
  color: #2d8cf0;
  background: #f0faff;
  z-index: 2;
}
.node-text-div {
  margin-left: 17px;
  height:17px;
  font-size:13px;
  font-family:MicrosoftYaHei;
  line-height:17px;
}

/**拖拽内容区域*/
.ml-drag-content-div {
  position: relative;
  height: 17px;
  line-height: 17px;
  box-sizing: border-box;
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;
  width: fill-available;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.vue-drag-node-icon {
  display: inline-block;
  position: absolute;
  right: 10px;
  transition: transform 0.3s ease-in-out;
}

.nodeClicked {
  transform: rotate(180deg);
}

/**拖拽上下区域*/
.ml-drag-top-div,.ml-drag-bottom-div {
  height: 14.5px;
}

.tree-node-div {
  padding: 1px 2px !important;
}
.tree-node-div.child-hover{
  padding: 0px 1px !important;
  border: 1px dashed rgba(89,140,168,1);
}
.tree-node-div.bottom-hover{
  padding: 1px 2px 0px 2px !important;
  border-bottom: 1px solid rgba(89,140,168,1);
}
.tree-node-div.top-hover{
  padding: 0px 2px 1px 2px !important;
  border-top: 1px solid rgba(89,140,168,1);
}

.ivu-tooltip{
  width: 100%;
}

.node-text-div,.ivu-tooltip-rel,.ivu-tooltip{
  height: 17px;
}

.node-icon-div{
  display: inline-block;
  width: 16px;
  height: 100%;
  margin-left: 17px; 
}

.menu-item-active-before::before{
  content: '';
  display: block;
  width: 2px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: #2d8cf0;
}
</style>

