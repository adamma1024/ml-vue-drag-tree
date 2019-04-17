<template>
  <div class="ivu-menu ivu-menu-light ivu-menu-vertical">
    <template v-for='(item,index) in children'>
      <drag-node
      :model='item'
      :allowDrag='allowDrag' 
      :allowDrop='allowDrop' 
      :depth='increaseDepth'  
      :key='index'
      :dragging='dragging'
      :open-names='openNames'
      :active-name='currentName'
      :max-char-num="maxCharNum"
      @on-node-click='changeOpenName'>
        <template v-slot:node-icon="slotProps">
          <slot name="icon" :node="slotProps.node"></slot>
        </template>
        <template v-slot:node-text="slotProps">
          <slot name="text" :node="slotProps.node"></slot>
        </template>
      </drag-node>
    </template>
  </div>
</template>

<script>
import DragNode from './DragNode'
import eventMixins from './mixins/eventMixins.js'
const lang = require('lodash/lang')

export default {
  name: 'VueDragTree',
  mixins: [eventMixins],
  props: {
    data: Array,
    allowDrag: {
      type: Function,
      default: () => true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    depth: {
      type: Number,
      default: 0
    },
    maxCharNum: {
      type: Number,
      default: 6
    },
    openNames: {
      type: Array,
      default: () => []
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dragging: false,
      children: this.data,
      currentName: this.activeName
    }
  },
  computed: {
    increaseDepth () {
      return this.depth + 1
    }
  },
  watch: {
    activeName(val){
      this.currentName = val
    },
    data(val, oldVal){
      if(val !== oldVal && this.children !== val){
        this.children = val
      }
    },
    children: {
      deep: true,
      handler: function(val){
        if(val !== this.data){
          this.$emit('on-data-change', val)
        }
      }
    }
  },
  methods: {
    emitCurNodeClicked (model, component) {
      this.currentName = model.id
      this.$emit('current-node-clicked', model, component)
    },
    emitDrag (model, component, e) {
      this.dragging = true
      this.$emit('drag', model, component, e)
    },
    emitDragEnter (model, component, e) {
      this.$emit('drag-enter', model, component, e)
    },
    emitDragLeave (model, component, e) {
      this.$emit('drag-leave', model, component, e)
    },
    emitDragOver (model, component, e) {
      this.$emit('drag-over', model, component, e)
    },
    emitDragEnd (model, component, e) {
      this.$emit('drag-end', model, component, e)
    },
    emitDrop (model, component, e) {
      this.dragging = false
      this.$emit('drop', model, component, e)
    },
    menuItemMouseIn (obj) {
      this.$emit('on-menu-mouse-in', obj)
    },
    menuItemMouseLeave (obj) {
      this.$emit('on-menu-mouse-leave', obj)
    },
    changeOpenName (id) {
      let index = this.openNames.indexOf(id)
      index > -1 ? this.openNames = [].concat(this.openNames.slice(0, index), this.openNames.slice(index + 1, this.openNames.length + 1)) : this.openNames.push(id)
    }
  },
  components: {
    DragNode
  }
}
</script>
