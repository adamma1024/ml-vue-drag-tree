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
    @dragenter.stop='dragCancel'
    @dragleave.stop='dragCancel'
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
          <slot name="node-icon" :data="model ? model : {}"></slot>
        </div>
        <div 
        :class='{"node-text-div ml-drag-content": true, "ivu-menu-item-hover":isHover}'>
          <slot name="node-text" :data="model ? model : {}"></slot>
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
      @menuitem-mouse-in="onMouseIn"
      @menuitem-mouse-leave="onMouseLeave"
      @on-node-click='onNodeClick'>
        <template #node-icon="{ data }">
          <slot name="node-icon" :data="data"></slot>
        </template>
        <template #node-text="{ data }">
          <slot name="node-text" :data="data"></slot>
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

import { findRoot, exchangeData } from './util'
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
      e.preventDefault()
    },
    dragLeaveChild (e) {
      this.isDragChildHover = false
      e.preventDefault()
    },
    dragEnterBottom (e) {
      this.isDragBottomHover = true
      e.preventDefault()
    },
    dragLeaveBottom (e) {
      this.isDragBottomHover = false
      e.preventDefault()
    },
    dragEnterTop (e) {
      this.isDragTopHover = true
      e.preventDefault()
    },
    dragLeaveTop (e) {
      this.isDragTopHover = false
      e.preventDefault()
    },
    dragCancel(e){
      // 经过元素边缘 防止鼠标样式变成禁止
      e.preventDefault()
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

<style lang='less' scoped>
@iview-bule: #2d8cf0;
@dnd-bg-color: #fff;
@dnd-is-clicked-bg-color: rgba(244,246,248,1);
@dnd-is-hover-bg-color: rgba(249,249,249,1);
@menu-item-bg-color: #f0faff;
@font-default: MicrosoftYaHei;
@height-default: 17px;
@margin-left-default: 17px;

@text-font: 13px;
@icon-font: 16px;

@drag-box-border-dashed: 1px dashed rgba(89,140,168,1);
@drag-box-border-solid-nocolor: 1px solid #fff;
@drag-box-border-solid-color: 1px solid rgba(89,140,168,1);

.dnd-container{
  background: @dnd-bg-color;
  &.is-clicked{
    background: @dnd-is-clicked-bg-color;
  }
  &.is-hover{
    background: @dnd-is-hover-bg-color;
  }
}

.item{
  cursor: pointer;
}

.bold{
  font-weight: bold;
}

.menu-item-active{
  color: @iview-bule;
  background: @menu-item-bg-color;
  z-index: 2;
}

.node-text-div{
  margin-left: @margin-left-default;
  height: @height-default;
  font-size: @text-font;
  font-family: @font-default;
  line-height: @height-default;
  display: inline-block;
}

/**拖拽内容区域*/
.ml-drag-content-div{
  position: relative;
  height: @height-default;
  line-height: @height-default;
  box-sizing: border-box;
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;
  width: fill-available;
  width: 100%;
  font-size: @icon-font;
  align-items: center;
}

.vue-drag-node-icon{
  display: inline-block;
  position: absolute;
  right: 10px;
  transition: transform 0.3s ease-in-out;
}

.nodeClicked{
  transform: rotate(180deg);
}

/**拖拽上下区域*/
.ml-drag-top-div{
  height: 14.5px;
}

.ml-drag-bottom-div:extend(.ml-drag-top-div){}

.tree-node-div{
  padding: 0px 2px !important;
  border: @drag-box-border-solid-nocolor;
  &.child-hover{
    border: @drag-box-border-dashed;
  }
  &.bottom-hover{
    border-bottom: @drag-box-border-solid-color;
  }
  &.top-hover{
    border-top: @drag-box-border-solid-color;
  }
}

.ivu-tooltip{
  width: 100%;
}

.node-text-div,.ivu-tooltip-rel,.ivu-tooltip{
  height: @height-default;
}

.node-icon-div{
  display: inline-block;
  width: @icon-font;
  height: 100%;
  margin-left: @margin-left-default; 
}

.menu-item-active-before{
  &:before{
    content: '';
    display: block;
    width: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: @iview-bule;
  }
}
</style>

