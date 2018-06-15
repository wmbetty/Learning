// pages/votemsg/votemsg.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({
  data: {
    voteLeft: true,
    isDelete: true,
    voteLists: []
  },
  onLoad: function (options) {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let voteMsgApi = backApi.voteMsg+token;
      Api.wxRequest(voteMsgApi,'GET',{},(res)=> {
        // console.log(res, 'sssss')
        let datas = res.data.data;
        that.setData({
          voteLists: datas
        })
      })
      let readVoteApi = backApi.readVoteApi+token;
      Api.wxRequest(readVoteApi,'PUT',{},(res)=> {
        console.log(res.data, 'read');
      })
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
    //   title: "消息"
    // })
    // wx.setNavigationBarColor({
    //   frontColor:'#ffffff',
    //   backgroundColor:'#E64340'  
    // })
  }
})