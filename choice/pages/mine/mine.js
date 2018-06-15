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
    myQuestionApi: '',
    points: 0,
    msgCount: 0,
    joinCurrPage: 0,
    myCurrPage: 0,
    myTotalPage: 0,
    joinTotalPage: 0,
    myTotalCount: 0,
    joinTotalCount: 0,
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
    let msgCount = wx.getStorageSync('msgTotal');
    console.log(msgCount)
      that.setData({
        msgCount: msgCount
      })

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
    let infoApi = backApi.myInfo+token;
      Api.wxRequest(infoApi,'GET',{},(res)=> {
        // console.log(res, 'sssss')
        let datas = res.data.data;
        // console.log(datas, 'dssss')
        that.setData({
          points: datas.points || 0
        })
      })

    let questionApi = backApi.my_question+token;
    let joinApi = backApi.my_join+token;
    that.setData({
      myQuestionApi: questionApi,
      joinApi: joinApi
    })

    Api.wxRequest(questionApi, 'GET', {}, (res)=> {
      if (res.data.status*1 === 200) {
        let myPublish = res.data.data;
        let myTotalPage = res.header['X-Pagination-Page-Count'];
        let myCurrPage = res.header['X-Pagination-Current-Page'];
        let myCount = res.header['X-Pagination-Total-Count'];
        that.setData({
          myPublish: myPublish,
          myTotalPage: myTotalPage,
          myCurrPage: myCurrPage,
          myTotalCount: myCount
        })
        // console.log(res.header,'hhhrr')
      }
    })
    Api.wxRequest(joinApi, 'GET', {}, (res)=> {
      if (res.data.status*1 === 200) {
        let myJoin = res.data.data;
        let joinTotalPage = res.header['X-Pagination-Page-Count'];
        let joinCurrPage = res.header['X-Pagination-Current-Page'];
        let joinCount = res.header['X-Pagination-Total-Count'];
        if (myJoin.length > 0) {
          that.setData({
            myJoin: myJoin,
            joinCurrPage: joinCurrPage,
            joinTotalPage: joinTotalPage,
            joinTotalCount: joinCount
          })
        }
      }
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
  onShow: function () {},
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
    let that = this;
    let isMine = that.data.isMine;
    let myCurrPage = that.data.myCurrPage*1;
    
    let joinCurrPage = that.data.joinCurrPage*1+1;
    // console.log(joinCurrPage,'myeeee')

    let questionApi = backApi.my_question+token;
    let joinApi = backApi.my_join+token;
    let myJoin = that.data.myJoin;
    let myTotalPage = that.data.myTotalPage*1;
    let joinTotalPage = that.data.joinTotalPage*1;
    if (!isMine) {
      if (joinTotalPage>1 && joinCurrPage <= joinTotalPage) {
        Api.wxRequest(joinApi, 'GET', {page:joinCurrPage}, (res)=> {
          if (res.data.status*1 === 200) {
            let myJoins = res.data.data;
            // console.log(myJoin)
            that.setData({
              myJoin: myJoin.concat(myJoins),
              joinCurrPage: joinCurrPage
            })
          }
        })
      } else {
        Api.wxShowToast('没有更多数据了', 'none', 2000);
      }
    } else {
      if (myTotalPage > 1 && myCurrPage < myTotalPage) {
        Api.wxRequest(questionApi, 'GET', {page:myCurrPage}, (res)=> {
          if (res.data.status*1 === 200) {
            let myPublish = res.data.data;
            // console.log(myJoin)
            that.setData({
              myPublish: myPublish.concat(myJoins),
              myCurrPage: myCurrPage
            })
          }
        })
      } else {
        Api.wxShowToast('没有更多数据了', 'none', 2000);
      }
    }
  },
  onShareAppMessage: function () {
  
  },
  onPageScroll (e) {
    if (e.scrollTop*1>=this.data.viewHeight/3) {
      wx.setNavigationBarColor({
        frontColor:'#ffffff',
        backgroundColor:'#E64340'  
      })
      wx.setNavigationBarTitle({
        title: "我"
      })
    } else {
      wx.setNavigationBarColor({
        frontColor:'#ffffff',
        backgroundColor:'#d7d7d9'  
      })
      wx.setNavigationBarTitle({
        title: ""
      })
    }
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
    }
  },
  // 详情
  gotoDetail (e) {
    // console.log(e, 'idd')
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`
    })
  }
})