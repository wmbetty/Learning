// pages/mine/mine.js
const tabBar = require('../../components/tabBar/tabBar.js');

Page({
  data: {
    leftPercent: 0.44,
    isMine: true,
    isBoy: true,
    showBlue: true,
    noPublish: false,
    noOthers: false,
    mineEmptyInfo: '你还没有发起选象哦',
    othersEmptyInfo: '你还没有参与哦',
    othersBlueText: '点击底部“选象”参与'
  },
  onLoad: function (options) {
    // wx.setNavigationBarTitle({
    //   title: '我'
    // });
    tabBar.tabbar("tabBar", 3, this);
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  // tab切换
  voteOthers (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    if (type === 'mine') {
      that.setData({
        isMine: true
      })
    } else {
      that.setData({
        isMine: false
      })
    }
  }
})