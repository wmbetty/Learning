// pages/messages/messages.js
const tabBar = require('../../components/tabBar/tabBar.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgNum: 9
  
  },
  onLoad: function (options) {
    tabBar.tabbar("tabBar", 1, this);
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll () {
    wx.setNavigationBarTitle({
      title: "消息"
    })
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor:'#E64340'  
    })
  },
  gotoVotemsg () {
    wx.navigateTo({
      url: '/pages/votemsg/votemsg'
    })
  },
  gotoNotice () {
    wx.navigateTo({
      url: '/pages/sysnotice/sysnotice'
    })
  }
})