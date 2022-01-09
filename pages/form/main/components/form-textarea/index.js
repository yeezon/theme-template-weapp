
Component({
  behaviors: ['wx://form-field-group'],
  properties: {
    data: {
      type: Object,
      value() {
        return {}
      }
    }
  },
  data: {},
  lifetimes: {
    attached() { },
    ready() {
      this.init()
    },
    moved() { },
    detached() { },
  },
  methods: {
    init() {
    }
  }
})