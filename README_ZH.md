# ml-vue-drag-tree

> 本项目基于shuirong的 [vue-drag-tree](https://github.com/shuirong/vue-drag-tree)，感谢

[![Version](http://img.shields.io/npm/v/ml-vue-drag-tree.svg)](https://www.npmjs.com/package/ml-vue-drag-tree)[![Downloads](http://img.shields.io/npm/dm/ml-vue-drag-tree.svg)](https://www.npmjs.com/package/ml-vue-drag-tree)[![License](https://img.shields.io/npm/l/ml-vue-drag-tree.svg?style=flat)](https://opensource.org/licenses/MIT)

> 这是一个Vue2.x的树组件。它允许你去拖拽任意节点，当然，“交换”会反映在data数据中。支持排序和嵌套

**功能**

- 对节点进行**任意拖拽**
- **控制**特定节点**是否可拖**、**是否可放置**其他节点
- 根据样式判断拖拽操作用于排序还是嵌套
- 数据和视图双向绑定

**[EN](README.md)** || **如果它对你有帮助的话，请Star支持！！！**
**[示例项目](https://github.com/qq240814476/ml-vue-drag-tree-demo)**

### 预览

------

![demo](static/vue-drag-tree.gif)

### 快速开始

------

**Install**

`npm install ml-vue-drag-tree --save`

**Usage**

[一个简单的项目，用了ml-vue-drag-tree](https://github.com/qq240814476/ml-vue-drag-tree-demo)

main.js

```vue
import Vue from 'vue'
import VueDragTree from 'ml-vue-drag-tree'
import 'ml-vue-drag-tree/dist/vue-drag-tree.min.css'

Vue.use(VueDragTree)
```

### 接口

---

**属性**

| 属性名     | 描述                                                  | 类型     | 默认值   |
| :--------- | :---------------------------------------------------- | :------- | :------- |
| data       | 节点树的数据                                          | Array    | －－     |
| allowDrag  | 判断哪些节点可以被拖拽（return true表示允许）         | Function | ()=>true |
| allowDrop  | 判断哪些节点可以被塞入其他节点（return true表示允许） | Function | ()=>true |
| openNames  | 打开菜单的array                                       | Array    | ()=>[]   |
| activeName | 当前激活状态的id                                      | String   | ''       |
| maxCharNum | text最多显示中文字符长度                              | Number   | 6        |



**事件**

| 事件名               | 描述                                                                     | 参数                                                                                                             |
| -------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| current-node-clicked | 告诉你哪个节点被点击了，这个节点所在的组件是哪个                         | (model,component) model: 当前被点击节点的数据． component: 当前节点所在的树组件                                  |
| drag                 | 节点被拖动时触发的 `drag` 事件                                           | (model,component,e) model: 当前被拖动节点的数据; component: 当前被拖动节点所在的树组件（VNode）; e: 拖拽事件     |
| drag-enter           | 当被拖动节点进入有效的放置目标时， `dragenter` 事件被触发                | (model,component,e) model: 有效放置目标节点的数据; component: 有效放置目标节点所在的树组件（VNode）; e: 拖拽事件 |
| drag-leave           | 当被拖动节点离开有效的放置目标时， `dragleave` 事件被触发                | (model,component,e) model: 有效放置目标节点的数据; component: 有效放置目标节点所在的树组件（VNode）; e: 拖拽事件 |
| drag-over            | 当节点被拖拽到一个有效的放置目标上时，触发 `dragover `事件               | (model,component,e) model: 有效放置目标节点的数据; component: 有效放置目标节点所在的树组件（VNode）; e: 拖拽事件 |
| drag-end             | 拖放事件在拖放操作结束时触发                                             | (model,component,e) model: 当前被拖动节点的数据; component: 当前被拖动节点所在的树组件（VNode）; e: 拖拽事件     |
| drop                 | 当节点被放置到一个有效的防止目标上时，`drop`被触发                       | (model,component,e) model: 当前被拖动节点的数据; component: 当前被拖动节点所在的树组件（VNode）; e: 拖拽事件     |
| on-data-change       | 树数据变化时触发                                                         | (data) new **tree** data                                                                                         |
| on-node-data-change  | 节点数据改变时触发,返回**事件类型**,**受影响父节点**和**拖动的节点**数据 | (type, parentNode, node) type:'remove'/'add'事件类型 parentNode: 受影响父节点 node: 拖动的节点的数据             |



**License**

------

[The 996ICU License (996ICU)](LICENSE)
