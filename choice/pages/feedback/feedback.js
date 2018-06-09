// pages/feedback/feedback.js
const Api = require('../../wxapi/wxApi');

Page({
  data: {
    textNum: 0,
    restNum: 200,
    isSubmit: false
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll () {
    wx.setNavigationBarTitle({
      title: "建议"
    })
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor:'#E64340'  
    })
  },
  putAdvice (e) {
    let val =  (e.detail.value).replace(/\s+/g,"");
    let textNum = val.length;
    let restNum = 200 - textNum*1;
    if (textNum >= 200) {
      Api.wxShowToast('建议最多200字哦', 'none', 2000);
      return false;
    }
    if (textNum) {
      this.setData({isSubmit: true})
    } else{
      this.setData({isSubmit: false})
    }
    this.setData({
      textNum: textNum,
      restNum: restNum
    })
  },
  submitAdvice () {
    let textNum = this.data.textNum;
    if (textNum) {

    } else {
      Api.wxShowToast('请填写建议', 'none', 2000);
    }
  }
})