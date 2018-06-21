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
    
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
  },
  onReady: function () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },
  onShow: function () {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let voteUnreadApi = backApi.voteUnreadApi+token;
      let noticeUnreadApi = backApi.noticeUnreadApi+token;
      let userInfo = wx.getStorageSync('userInfo');
      
      if (!userInfo.language) {
        that.setData({
          showDialog: true
        })
      } else {
        wx.setStorageSync('msgTotal', 0);
        wx.setStorageSync('voteUnreadCount', 0);
        Api.wxRequest(voteUnreadApi,'GET',{},(res)=> {
          let vcount = res.data.data.vote
          that.setData({
            voteUnreadCount: vcount
          })
        })
        Api.wxRequest(noticeUnreadApi,'GET',{},(res)=> {
          let ncount = res.data.data.notice
          that.setData({
            noticeUnreadCount:ncount
          })
        })
      }
    }, 1000)
    
  },
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
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
      
      if (!userInfo.nickName) {
        that.setData({
          showDialog: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/votemsg/votemsg'
        })
        that.setData({
          voteUnreadCount: 0
        })
        wx.setStorageSync('msgTotal', 0);
      }
  },
  gotoNotice () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
      
      if (!userInfo.nickName) {
        that.setData({
          showDialog: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/sysnotice/sysnotice'
        })
        that.setData({
          noticeUnreadCount: 0
        })
      }
    
  },
  gotoFeed () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
      
      if (!userInfo.nickName) {
        that.setData({
          showDialog: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/feedback/feedback'
        })
      }
  }
})