// components/row-list/row-list.js
/**
 * title	[说明]：列表项左侧的标题。
[类型]：String
[默认值]：""
detail	[说明]：标题下方的的详细描述。
[类型]：String
[默认值]：""
desc	[说明]：列表项右侧的描述。
[类型]：String
[默认值]：""
src	[说明]：标题前面的图标，自定义图片链接。优先级高于 icon。
[类型]：String
[默认值]：""
iconSrc	[说明]：标题前面的图标。
[类型]：String
[默认值]：""
dot	[说明]：右侧描述部分前面的提醒红点。
[类型]：Boolean
[默认值]：false
dot-color	[说明]：右侧描述部分前面的提醒红点颜色，与 dot 一同使用。
[类型]：String
[默认值]：#f5123e
arrow	[说明]：是否显示箭头。
[类型]：Boolean
[默认值]：true
mode	[说明]：列表项边框模式。
[类型]：String
[可选值]：normal，有下边框；none，无边框。
[默认值]：normal
bind:click	[说明]：点击列表项时触发的事件。组件带 slot 时给组件添加原生事件后点击到 slot 时会报错，故增加自定义事件避免此错误。
open-type	[说明]：打开微信开放能力。
[类型]String
[默认值]：''
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '' // 标题
    },
    detail: {
      type: String,
      value: '' // 标题下方的具体描述
    },
    desc: {
      type: String,
      value: '' // 右侧描述部分
    },
    iconSrc: {
      type: String,
      value: '' // 标题左侧icon
    },
    src: {
      type: String,
      value: '' // 标题左侧icon图片链接
    },
    dot: {
      type: Boolean,
      value: false // 右侧描述部分的左侧红点
    },
    dotColor: {
      type: String,
      value: '#f5123e' // 右侧描述部分的左侧红点颜色
    },
    arrow: {
      type: Boolean,
      value: true  // 是否显示箭头
    },
    mode: {
      type: String,
      value: 'normal' // 有边框和无边框 normal, none
    },
    openType: {
      type: String,
      value: '' // 微信开放能力
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(event) {
      let detail = event.detail;
      let option = {};
      this.triggerEvent('click', detail, option);
    }
  }
})

