// pages/messages/messages.js
const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgNum: 9,
    voteUnreadCount: 0,
    noticeUnreadCount: 0,
    showDialog: false,
    msgCount: 0,
    viewHeight: 0
  
  },
  cancelDialog () {
    let that = this;
    that.setData({
      showDialog: false
    })
  },
  confirmDialog (e) {
    let that = this;
    let userInfoApi = backApi.userInfo+token;
    that.setData({
      showDialog: false
    });
    wx.getUserInfo({
      success: (res)=>{
        let userInfo = res.userInfo;
        if (userInfo.nickName) {
          wx.setStorageSync('userInfo', userInfo);
          Api.wxRequest(userInfoApi,'PUT',userInfo,(res)=> {
            console.log(res.data.status, 'sssssssss')
          })
        }
      }
    })
  },
  onLoad: function (options) {
    let that = this;
    tabBar.tabbar("tabBar", 1, that);
    setTimeout(()=> {
      token = app.globalData.access_token;
      let voteUnreadApi = backApi.voteUnreadApi+token;
      let noticeUnreadApi = backApi.noticeUnreadApi+token;
      let userInfo = wx.getStorageSync('userInfo');
      let msgCount = wx.getStorageSync('msgTotal');
      wx.setStorageSync('msgTotal', 0)
      if (!userInfo.nickName) {
        that.setData({
          showDialog: true
        })
      }
      Api.wxRequest(voteUnreadApi,'GET',{},(res)=> {
        let vcount = res.data.data.vote
        that.setData({
          voteUnreadCount: vcount
        })
      })
      Api.wxRequest(noticeUnreadApi,'GET',{},(res)=> {
        let ncount = res.data.data.notice
        that.setData({
          noticeUnreadCount: ncount
        })
      })
    }, 1000)
  },
  onReady: function () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll () {
    // if (e.scrollTop*1>=this.data.viewHeight/3) {
    //   wx.setNavigationBarColor({
    //     frontColor:'#ffffff',
    //     backgroundColor:'#E64340'  
    //   })
    //   wx.setNavigationBarTitle({
    //     title: "消息"
    //   })
    // } else {
    //   wx.setNavigationBarColor({
    //     frontColor:'#ffffff',
    //     backgroundColor:'#F5F6F8'  
    //   })
    //   wx.setNavigationBarTitle({
    //     title: ""
    //   })
    // }
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
  },
  gotoFeed () {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  }
})