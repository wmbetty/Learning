// pages/details/details.js
const Api = require('../../wxapi/wxApi');

Page({
  data: {
    leftPercent: 0.36,
    isLeft: false,
    showMask: false,
    isShare: false,
    isDelete: false,
    winHeight: 0,
    leftChoiceText: 'hhhh哈哈哈哈哈嘿嘿嘿嘿嘿嘿嘿或或或哈哈设计案发舒服舒服勘设股份电话是否公司股份',
    rightChoiceText: '啦啦啦啦啦啦啦啦啦哈哈哈哈呵呵呵呵呵呵呵呵嘎嘎嘎嘎嘎过过很舒服的时间发货司法鉴定所好多分公司计划鬼斧神工'
  },
  textNumTest (text) {
    let chineseReg = /[\u4E00-\u9FA5]/g;
    if (chineseReg.test(text)) {
      if (text.match(chineseReg).length >= 30) {  //返回中文的个数  
        text = text.substring(0, 29) + "...";
        return text; 
      } else {
        return text
      } 
    }
  },
  onLoad: function (options) {
    let that = this;
    let leftText = that.textNumTest(that.data.leftChoiceText);
    let rightText = that.textNumTest(that.data.rightChoiceText);
    that.setData({
      leftChoiceText: leftText,
      rightChoiceText: rightText
    })
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({winHeight: res.windowHeight});
      }
    })
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
      title: "详情"
    })
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor:'#E64340'  
    })
  },
  gotoShare () {
    this.setData({
      isShare: true,
      isDelete: false,
      showMask: true
    })
  },
  cancelShare () {
    this.setData({
      showMask: false
    })
  },
  gotoDelete () {
    this.setData({
      isDelete: true,
      isShare: false,
      showMask: true
    })
  },
  deleteChoice () {
    this.setData({
      showMask: false
    })
    Api.wxShowModal('', '删除后不可恢复，是否确认删除？', true, (res) => {
      console.log(res)
    })
  },
  shareToMoment () {
    console.log('moment')
  },
  shareToFriends () {
    console.log('friends')
  }
})