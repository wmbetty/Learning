// pages/gcindex/gcindex.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');

const tabBar = require('../../components/tabBar/tabBar.js');
let baseLock = '';


Page({
  data: {
    token: '',
    voteUnreadCount: 0,
    msgCount: 0,
    commentTotal: 0,
    baseRedDot: 0
  },

  onLoad: function (options) {
    let that = this;
    tabBar.tabbar("tabBar", 0, that);

    let questId = wx.getStorageSync('quesid');
    if (questId) {
      wx.navigateTo({
        url: `/pages/details/details?id=${questId}`
      })
      setTimeout(()=> {
        wx.setStorageSync('quesid', '');
      }, 300)
    }
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this
    backApi.getToken().then(function(response) {
      if (response.data.status*1===200) {
        let token = response.data.data.access_token;
        let voteUnreadApi = backApi.voteUnreadApi+token;
        let msgTotalApi = backApi.msgUnreadTotal+token;
        let commTotalApi = backApi.commentUnreadApi+token;

        // let userInfo = wx.getStorageSync('userInfo', userInfo);
        // let userInfoApi = backApi.userInfo+token;
        // if (userInfo) {
        //   let userData = {
        //     avatarUrl: userInfo.avatarUrl,
        //     nickName: userInfo.nickName,
        //     country: userInfo.country,
        //     city: userInfo.city,
        //     language: userInfo.language,
        //     province: userInfo.province,
        //     gender: userInfo.gender
        //   };
        //
        //   // 更新用户信息
        //   Api.wxRequest(userInfoApi,'PUT',userData,(res)=>{
        //     baseLock = res.data.data.user_base_lock;
        //     if (baseLock*1===2) {
        //       that.setData({baseRedDot: 1});
        //     }
        //   });
        // }

        // 获取投票信息
        Api.wxRequest(voteUnreadApi,'GET',{},(res)=>{
          if (res.data.status*1===200) {
            if (res.data.data.vote) {
              that.setData({voteUnreadCount: res.data.data.vote});
            }
          }
        });
        // 获取通知数量
        Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
          if (res.data.status*1===200) {
            let msgTotal = res.data.data.total;
            if (msgTotal) {
              that.setData({msgCount: msgTotal});
            }
          }
        });
        // 获取评论数量
        Api.wxRequest(commTotalApi,'GET',{},(res)=>{
          if (res.data.status*1===200) {
            let commentTotal = res.data.data.total;
            if (commentTotal) {
              that.setData({commentTotal: commentTotal});
            }
          }
        });

        setInterval(()=>{
          // 获取投票信息
          Api.wxRequest(voteUnreadApi,'GET',{},(res)=>{
            if (res.data.status*1===200) {
              if (res.data.data.vote) {
                that.setData({voteUnreadCount: res.data.data.vote});
              }
            }
          });
          // 获取通知数量
          Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
            if (res.data.status*1===200) {
              let msgTotal = res.data.data.total;
              if (msgTotal) {
                that.setData({msgCount: msgTotal});
              }
            }
          });
          // 获取评论数量
          Api.wxRequest(commTotalApi,'GET',{},(res)=>{
            if (res.data.status*1===200) {
              let commentTotal = res.data.data.total;
              if (commentTotal) {
                that.setData({commentTotal: commentTotal});
              }
            }
          });
        },8000)
      } else {
        Api.wxShowToast('网络出错了，请稍后再试哦~', 'none', 2000)
      }
    })
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
  
  }
})