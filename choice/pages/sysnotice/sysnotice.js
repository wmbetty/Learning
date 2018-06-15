// pages/votemsg/votemsg.js
const Api = require('../../wxapi/wxApi');
const backApi = require('../../utils/util');
const app = getApp();
let token = '';

Page({
  data: {
    noData: false,
    showBlue: false,
    noticeLists: []
  },
  onLoad: function (options) {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let noticeMsg = backApi.noticeMsg+token;
      Api.wxRequest(noticeMsg,'GET',{},(res)=> {
        // console.log(res, 'sssss')
        let datas = res.data.data;
        that.setData({
          noticeLists: datas
        })
      })
      // let readNoticeApi = backApi.readNoticeApi+token;
      // Api.wxRequest(readNoticeApi,'PUT',{},(res)=> {
      //   console.log(res.data, 'read');
      // })
    }, 1000)
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
    //   title: "通知"
    // })
    // wx.setNavigationBarColor({
    //   frontColor:'#ffffff',
    //   backgroundColor:'#E64340'  
    // })
  }
})