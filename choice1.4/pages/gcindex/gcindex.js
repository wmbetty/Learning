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
    baseRedDot: 0,
    interval: 3000,
    duration: 800,
    indicatorColor: 'rgba(199, 199, 204, 1)',
    dotActiveColor: '#666666',
    bannerList: [],
    categoryList: [],
    topicList: [],
    showDialog: false,
    showPage: false
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

    wx.setNavigationBarColor({
      frontColor:'#000000',
      backgroundColor:'#F5F6F8'
    });

    wx.showLoading({
      title: '加载中',
      mask: true
    });

    backApi.getToken().then(function(response) {
      if (response.data.status * 1 === 200) {
        let token = response.data.data.access_token;
        let bannerApi = backApi.bannerApi+token;
        let categoryListApi = backApi.categoryListApi+token;
        let topicListApi = backApi.topicListApi+token;
        that.setData({token: token});
        Api.wxRequest(bannerApi,'GET',{},(res)=>{
          if (res.data.status*1===201) {
            wx.hideLoading();
            that.setData({bannerList: res.data.data,showPage: true})
          } else {
            Api.wxShowToast('轮播图获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(categoryListApi,'GET',{},(res)=>{
          if (res.data.status*1===201) {
            let category = res.data.data;
            that.setData({categoryList: category})
          } else {
            Api.wxShowToast('分类获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(topicListApi,'GET',{},(res)=>{
          if (res.data.status*1===200) {
            let topic = res.data.data;
            that.setData({topicList: topic})
          } else {
            Api.wxShowToast('话题获取失败~', 'none', 2000)
          }
        })
      } else {
        Api.wxShowToast('token获取失败~', 'none', 2000)
      }
    })

  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this
    backApi.getToken().then(function(response) {
      if (response.data.status*1===200) {
        let token = response.data.data.access_token;
        that.setData({token: token});
        let voteUnreadApi = backApi.voteUnreadApi+token;
        let msgTotalApi = backApi.msgUnreadTotal+token;
        let commTotalApi = backApi.commentUnreadApi+token;

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
  
  },
  cancelDialog () {
    let that = this;
    that.setData({showDialog: false});
  },
  confirmDialog () {
    let that = this;
    that.setData({
      showDialog: false
    });
    wx.login({
      success: function (res) {
        let code = res.code;
        wx.getUserInfo({
          success: (res) => {
            let userData = {
              encryptedData: res.encryptedData,
              iv: res.iv,
              code: code
            }
            backApi.getToken().then(function (response) {
              if (response.data.status * 1 === 200) {
                let token = response.data.data.access_token;
                let userInfoApi = backApi.userInfo + token;
                Api.wxRequest(userInfoApi,'POST',userData,(res)=> {
                  if (res.data.status*1===200) {
                    wx.setStorageSync('userInfo', res.data.data);
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  // 去分类详情
  goCateDetail (e) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo', userInfo);
    if (userInfo.id) {
      let title = e.currentTarget.dataset.title;
      let cid = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/categotries/categotries?title=${title}&id=${cid}`
      })
    } else {
      that.setData({showDialog: true});
    }
  },
  goRank () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo', userInfo);
    if (userInfo.id) {
      wx.navigateTo({
        url: `/pages/rankboard/rankboard`
      })
    } else {
      that.setData({showDialog: true});
    }
  },
  bannerGo (e) {
    console.log(e, 'link')
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
  }
})