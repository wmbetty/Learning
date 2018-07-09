// pages/feedback/feedback.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
// let token = '';

Page({
  data: {
    textNum: 0,
    restNum: 200,
    isSubmit: false,
    mobile: '',
    content: '',
    contVal: '',
    submitDis: false,
    token: ''
  },
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
    // 获取token
    backApi.getToken().then(function(response) {
      let token = response;
      that.setData({token:token})
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
    // wx.setNavigationBarTitle({
    //   title: "建议"
    // })
    // wx.setNavigationBarColor({
    //   frontColor:'#ffffff',
    //   backgroundColor:'#E64340'  
    // })
  },
  putMobile (e) {
    let val =  (e.detail.value).replace(/\s+/g,"");
    let mobileReg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!mobileReg.test(val)) {
      Api.wxShowToast('请填写11位有效手机号', 'none', 2000);
    } else {
      this.setData({mobile: val})
    }
    
  },
  // textNumTest (text) {
  //   let chineseReg = /[\u4E00-\u9FA5]/g;
  //   if (chineseReg.test(text)) {
  //     if (text.match(chineseReg).length >= 30) {  //返回中文的个数  
  //       text = text.substring(0, 29) + "...";
  //       return text; 
  //     } else{
  //       return text
  //     }  
  //   } else {
  //     return text
  //   }
  // },
  putAdvice (e) {
    let that = this;
    let val =  e.detail.value;
    let textNum = val.length;
    let restNum = 200 - textNum*1;
    if (textNum > 200) {
      Api.wxShowToast('建议最多200字哦', 'none', 2000);
    } else if (0<textNum<=200){
      val = val.substring(0, 200)
      that.setData({
        isSubmit: true,
        content: val,
        contVal: val,
        textNum: textNum,
        restNum: restNum
      })
    }
  },
  submitAdvice () {
    let that = this;
    let textNum = that.data.textNum;
    let token = that.data.token;
    let feedApi = backApi.feedback+token;
    let feedData = {
      content: that.data.content,
      mobile: that.data.mobile
    }
    
    if (textNum) {
      that.setData({
        submitDis: true
      })
      Api.wxRequest(feedApi,'POST',feedData,(res)=> {
        that.setData({
          isSubmit: false
        })
        wx.showLoading({
          title: '提交中',
          mask: true
        });
        if (res.data.status*1===201 && res.data.data.id) {
          wx.hideLoading();
          that.setData({
            submitDis: false
          })
          Api.wxShowToast('感谢你的建议，小象会及时跟进哟~', 'none', 2200);
          setTimeout(()=> {
            wx.navigateBack({
              delta: 1
            })
          }, 600)
        }
      })
    } else {
      Api.wxShowToast('填写建议反馈后方能提交哦', 'none', 2000);
    }
  }
})