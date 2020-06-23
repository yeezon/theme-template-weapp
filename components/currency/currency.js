const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],

  properties: {
    value: {
      type: Number,
      value: 0
    }
  },

  computed: {
    cValue(data) {
      const { value } = data
      return ( value / 100 ).toFixed(2)
    }
  }
})