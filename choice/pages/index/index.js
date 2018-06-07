const tabBar = require('../../components/tabBar/tabBar.js');
const Api = require('../../wxapi/wxApi');

Page({
  data: {
    showTextarea: false,
    showLeft: false,
    showRight: false,
    leftHolder: '点击输入左选项',
    rightHolder: '点击输入右选项'
  },
  onLoad: function(option) {
    tabBar.tabbar("tabBar", 2, this);//0表示第一个tabbar
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },
  textFocus () {
    this.setData({
      showTextarea: true
    })
  },
  contFocus (e) {
    let that = this;
    let direct = e.target.dataset.direct;
    if (direct === 'left') {
      that.setData({
        showLeft: true,
        leftHolder: ''
      })
    } else {
      this.setData({
        showRight: true,
        rightHolder: ''
      })
    }
  },
  titlePut (e) {
    let that = this;
    let val = e.detail.value;
    let chineseReg = /[\u4E00-\u9FA5]/g;
    if (val.trim().length > 30) {
      console.log('超出了')
    }
  }
});