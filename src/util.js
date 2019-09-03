import Vue from 'vue'
const lang = require('lodash/lang')

// 返回最顶层那个vue-drag-tree.vue组件
const findRoot = which => {
  let ok = false
  let that = which
  while (!ok) {
    // 根据组件name来判断
    if (that.$options._componentTag === 'vue-drag-tree') {
      ok = true
      // 交换两者的数据
      break
    }
    that = that.$parent
  }
  return that
}

/**
 * 是否两节点为包含关系
 * 即：直系父与子的关系
 * @param {*} from 拖拽节点
 * @param {*} to 放置区域元素
 */
const hasInclude = (from, to) => {
  return from.$parent._uid === to._uid
}

/**
 * 可以触发Vue响应式的数组删除节点方法
 * @param {*} arr 节点数组
 * @param {*} id 删除node的id
 * @param {*} isRoot 是否是根节点默认为false
 */
const deleteNodeInVueResponsive = (arr, id, isRoot = false) => {
  if (isRoot) {
    arr.data = arr.data.filter(
      item => item.id !== id
    )
    if (arr.data.length !== 0) {
      Vue.set(arr, 'data', arr.data)
    }
  } else {
    arr.children = arr.children.filter(
      item => item.id !== id
    )
    if (arr.children.length !== 0) {
      Vue.set(arr, 'children', arr.children)
    } else {
      Vue.delete(arr, 'children')
    }
  }
}

/**
 * 可以触发Vue响应式的数组增加节点方法
 * @param {*} arr 节点数组
 * @param {*} node 添加的节点
 */
const addNodeInVueResponsive = (arr, node) => {
  // 再from节点添加到to节点中最后一位。
  if (arr.data) {
    Vue.set(arr.data, arr.data.length, node)
  } else {
    if (!arr.children) {
      Vue.set(arr, 'children', [node])
    } else {
      Vue.set(arr.children, arr.children.length, node)
    }
  }
}

/**
 * 可以触发Vue响应式的数组交换节点位置方法
 * @param {*} newFrom 换位置的元素
 * @param {*} to 目标元素
 * @param {*} behind 是否插在目标后面，默认为true
 */
const exchangePosInVueResponsive = (newFrom, to, behind = true) => {
  let toParentModel = to.$parent.model || { id: null, children: to.$parent.data }
  let index = toParentModel.children.indexOf(to.model)
  let newIndex = behind ? index + 1 : index
  toParentModel.children.splice(newIndex, 0, newFrom)
  to.$set(toParentModel.children, newIndex, newFrom)
  return toParentModel
}

/**
 * 交换两节点数据
 * @param from 被拖拽节点组件Vnode数据
 * @param to 拖拽节点组件Vnode数据
 */
const exchangeData = (from, to, e) => {
  // 没放对地方，什么都不做
  if (!to.isDragChildHover && !to.isDragTopHover && !to.isDragBottomHover) {
    return
  }

  // 如果拖动节点和被拖动节点相同，return;
  if (from._uid === to._uid) {
    return
  }

  // 如果两者是父子关系且from是父节点，to是子节点，什么都不做
  if (hasInclude(to, from)) {
    return
  }

  let newFrom = lang.cloneDeep(from.model)
  let fromParentModel = from.$parent.model
  let toModel = to.model

  let parentNode = {}
  let root = findRoot(to)

  // 先将from从其父节点信息移除；
  if (from.$parent.$options._componentTag === 'vue-drag-tree') {
    /**
     * 找到vue-drag-tree的父组件（数据源头），在这里修改数据。
     */
    deleteNodeInVueResponsive(from.$parent, newFrom.id, true)
    parentNode = {id: null, children: from.$parent.data}
  } else {
    deleteNodeInVueResponsive(fromParentModel, newFrom.id)
    parentNode = fromParentModel
  }

  // 发送删除节点事件
  root.removeChild(parentNode, newFrom)

  const bottom = to.isDragBottomHover
  const top = to.isDragTopHover
  from.$nextTick(() => {
    if (bottom) {
      // 交换位置，插到后面
      parentNode = exchangePosInVueResponsive(newFrom, to)
    } else if (top) {
      // 交换位置，插到前面
      parentNode = exchangePosInVueResponsive(newFrom, to, false)
    } else {
      // 嵌套添加
      addNodeInVueResponsive(toModel, newFrom)
      parentNode = toModel
    }

    Vue.set(root.data, 0, lang.cloneDeep(root.data[0]))
    // 发送添加节点事件
    root.addChild(parentNode, newFrom)
    root.endChange()
  })
}

const charWidthTable = {
  1: ['.', '!', '|', ','],
  2: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z', '@', '~', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+', '{', '}', '[', ']', '\\', '/', '<', '>',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ]
}

const getCharWidth = (char) => {
  for (let i = 0; i < charWidthTable[1].length; i++) {
    if (char === charWidthTable[1][i]) {
      return 1
    }
  }
  for (let i = 0; i < charWidthTable[2].length; i++) {
    if (char === charWidthTable[2][i]) {
      return 1.5
    }
  }
  return 3
}

export const shortText = function (text, length) {
  text = text || ''
  let showtextShort = text
  let short = true
  let strArr = text.split('')
  let strWidth = []
  let sum = 0
  for (let i = 0; i < strArr.length; i++) {
    sum += getCharWidth(strArr[i])
    strWidth.push(sum)
  }
  let lengthFlag = length * 3
  if (sum > lengthFlag) {
    short = false
    let splitPoint = 0
    for (let j = 0; j < strWidth.length; j++) {
      if (strWidth[j] > lengthFlag) {
        splitPoint = j
        break
      }
    }
    showtextShort = text.substring(0, splitPoint) + '...'
  }
  return short ? false : showtextShort
}
export { findRoot, exchangeData }
