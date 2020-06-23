// components/stepper/stepper.js
Component({
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    integer: Boolean,
    disabled: Boolean,
    disableInput: Boolean,
    min: {
      type: null,
      value: 1
    },
    max: {
      type: null,
      value: 999999999,
      observer(val) {
        this.setData({
          value: val < this.data.value ? val : this.data.value
        })
        this.triggerEvent('change', this.data.value);
      }
    },
    step: {
      type: null,
      value: 1
    },
    value: {
      type: Number,
      value: 1
    },
    minType: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready() {
    this.setData({
      value: this.range(this.data.value)
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // limit value range
    range: function(value) {
      return Math.max(Math.min(this.data.max, value), this.data.min);
    },
    onInput: function(event) {
      var _ref = event.detail || {},
        _ref$value = _ref.value,
        value = _ref$value === void 0 ? '' : _ref$value;
      if (/^\+?[1-9][0-9]*$/.test(value)) {
        // this.triggerInput(value);
        this.setData({
          value: value
        });
      }
    },
    onChange: function(type) {
      var diff = type === 'minus' ? -this.data.step : +this.data.step;
      var value = Math.round((this.data.value + diff) * 100) / 100;
      if ((type === 'plus' && value > this.data.max) || (type === 'minus' && value < this.data.min)) return
      this.triggerInput(this.range(value));
      this.triggerEvent(type);
    },
    onBlur: function(event) {
      var value = this.range(this.data.value);
      this.triggerInput(value);
      this.triggerEvent('blur', event);
    },
    onMinus: function() {
      this.onChange('minus');
    },
    onPlus: function() {
      this.onChange('plus');
    },
    triggerInput: function(value) {
      this.setData({
        value: value
      });
      this.triggerEvent('change', value);
    }
  }
})