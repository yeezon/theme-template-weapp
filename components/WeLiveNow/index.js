
// * 四个角坐标设置
//     1. 是否显示开关
//     2. room-id 空的时候跳去列表，暂时提示暂无直播
//     3. 直播结束后 去回放
//     4. 描述空的时候，自动描述

const livePlayer = requirePlugin('live-player-plugin')

Component({
  externalClasses: ['custom-class'],
  properties: {
    roomId: {
      type: String,
      value: ''
    }
  },
  data () {
    return {
      nLiveStatus: null
    }
  },
  methods: {
    init () {
      const roomId = this.properties.roomId || ''

      if (roomId) {
        livePlayer.getLiveStatus({ room_id: roomId }).then(res => {
          // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常, 107：已过期 
          const liveStatus = res.liveStatus || null

          this.setData({
            nLiveStatus: liveStatus
          })
        }).catch(err => {
          // console.log(err)
        })
      }
    },
  },
  attached () {
    this.init()
  }
})
