// pages/feedback/feedback.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({
  data: {
    textNum: 0,
    restNum: 200,
    isSubmit: false,
    mobile: '',
    content: ''
  },
  onLoad: function (options) {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
    },200)
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
      title: "建议"
    })
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor:'#E64340'  
    })
  },
  putMobile (e) {
    let val =  (e.detail.value).replace(/\s+/g,"");
    this.setData({mobile: val})
  },
  putAdvice (e) {
    let that = this;
    let val =  (e.detail.value).replace(/\s+/g,"");
    let textNum = val.length;
    let restNum = 200 - textNum*1;
    
    if (textNum >= 200) {
      Api.wxShowToast('建议最多200字哦', 'none', 2000);
      return false;
    }
    if (textNum) {
      that.setData({
        isSubmit: true,
        content: val
      })
    } else{
      that.setData({isSubmit: false})
    }
    that.setData({
      textNum: textNum,
      restNum: restNum
    })
  },
  submitAdvice () {
    let that = this;
    let textNum = this.data.textNum;
    let feedApi = backApi.feedback+token;
    let feedData = {
      content: that.data.content,
      mobile: that.data.mobile
    }
    if (textNum) {
      Api.wxRequest(feedApi,'POST',feedData,(res)=> {
        console.log(res, 'feed')
        if (res.data.status*1===201 && res.data.data.id) {
          Api.wxShowToast('提交成功', 'none', 2200);
          setTimeout(()=> {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    } else {
      Api.wxShowToast('请填写建议', 'none', 2000);
    }
  }
})