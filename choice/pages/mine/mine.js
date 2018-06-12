// pages/mine/mine.js
const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({
  data: {
    leftPercent: 0.44,
    isMine: true,
    isBoy: true,
    showBlue: true,
    mineEmptyInfo: '你还没有发起选象哦',
    othersEmptyInfo: '你还没有参与哦',
    othersBlueText: '点击底部“选象”参与',
    myPublish: [],
    myJoin: [],
    userInfo: {},
    showDialog: false,
    joinApi: '',
    myQuestionApi: ''
  },
  cancelDialog () {
    let that = this;
    that.setData({
      showDialog: false
    })
  },
  confirmDialog (e) {
    let that = this;
    that.setData({
      showDialog: false
    });
    wx.getUserInfo({
      success: (res)=>{
        let userInfo = res.userInfo;
        if (userInfo.nickName) {
          wx.setStorageSync('userInfo', userInfo);
          that.setData({
            userInfo: userInfo
          })
        }
      }
    })
  },
  onLoad: function (options) {
    let that = this;
    tabBar.tabbar("tabBar", 3, this);
    let profile = options.profile || '';
    if (profile) {
      wx.setNavigationBarTitle({
        title: ''
      });
    }
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.nickName) {
      that.setData({
        userInfo: userInfo
      })
    } else {
      that.setData({
        showDialog: true
      })
    }

    token = app.globalData.access_token;
    let questionApi = backApi.my_question+token;
    let joinApi = backApi.my_join+token;
    that.setData({
      myQuestionApi: questionApi,
      joinApi: joinApi
    })

    Api.wxRequest(questionApi, 'GET', {}, (res)=> {
      // console.log(res.data.status, 'gui')
      if (res.data.status*1 === 200) {
        let myPublish = res.data.data;
        that.setData({
          myPublish: myPublish
        })
      }
    })
    
  },
  onReady: function () {},
  onShow: function () {},
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
  // tab切换
  voteOthers (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let joinApi = that.data.joinApi;
    let myQuestionApi = that.data.myQuestionApi;
    if (type === 'mine') {
      that.setData({
        isMine: true
      })
    } else {
      that.setData({
        isMine: false
      })
      Api.wxRequest(joinApi, 'GET', {}, (res)=> {
        console.log(res, 'join')
        if (res.status*1 === 200) {
          let myJoin = res.data.data || [];
          that.setData({
            myJoin: myJoin
          })
        }
      })
    }
  },
  // 详情
  gotoDetail () {
    wx.navigateTo({
      url: '/pages/details/details'
    })
  }
})