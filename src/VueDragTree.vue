<template>
  <div class="ivu-menu ivu-menu-light ivu-menu-vertical">
    <template v-for='(item,index) in data'>
      <drag-node
      :model='item'
      :allowDrag='allowDrag' 
      :allowDrop='allowDrop' 
      :depth='increaseDepth'  
      :key='index'
      :dragging='dragging'
      :open-names='currOpenNames'
      :active-name='currentName'
      @on-node-click='changeOpenName'>
        <template #node-icon="{ data }">
          <slot name="node-icon" :node="data">
            <Icon :type="data.icon"></Icon>
          </slot>
        </template>
        <template #node-text="{ data }">
          <slot name="node-text" :node="data">
            <Tooltip
            :content="data.title" 
            placement="top-start"
            max-width="200" 
            :delay="1000" transfer theme="light" :disabled="shortText(data.title, this.maxCharNum) === false">
              <span class='text'>{{formatText(data.title)}}</span>
            </Tooltip>
          </slot>
        </template>
      </drag-node>
    </template>
  </div>
</template>

<script>
import DragNode from './DragNode'
import eventMixins from './mixins/eventMixins.js'
import { shortText } from './util'
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
      type: [String ,Number],
      default: ''
    }
  },
  data () {
    return {
      dragging: false,
      currentName: this.activeName,
      currOpenNames: this.openNames
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
    openNames:{
      deep: true,
      handler: function(val){
        this.currOpenNames = this.openNames
      }
    }
  },
  methods: {
    shortText,
    formatText(text){
      let t = shortText(text, this.maxCharNum)
      return t ? t : text
    },
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
      let index = this.currOpenNames.indexOf(id)
      index > -1 ? this.currOpenNames = [].concat(this.currOpenNames.slice(0, index), this.currOpenNames.slice(index + 1, this.currOpenNames.length + 1)) : this.currOpenNames.push(id)
      this.$emit('on-open-name-change', this.currOpenNames)
    }
  },
  components: {
    DragNode
  }
}
</script>
