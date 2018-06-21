// pages/votemsg/votemsg.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({
  data: {
    voteLeft: true,
    isDelete: false,
    voteLists: [],
    noDatas: false
  },
  onLoad: function (options) {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let voteMsgApi = backApi.voteMsg+token;
      wx.showLoading({
        title: '加载中',
      });
      Api.wxRequest(voteMsgApi,'GET',{},(res)=> {
        // console.log(res, 'sssss')
        if (res.data.status*1===200) {
          wx.hideLoading();
          let datas = res.data.data || [];
          if (datas.length>0) {
            that.setData({
              voteLists: datas
            })
          } else{
            that.setData({
              noDatas: true
            })
          }
        }
      })
      
    }, 50)
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
    setTimeout(()=>{
      let readVoteApi = backApi.readVoteApi+token;
      Api.wxRequest(readVoteApi,'PUT',{},(res)=> {
        console.log(res.data, 'read');
      })
    },3000)
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {
    
  },
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
  },
  // 到他人中心
  gotoOthers (e) {
    // console.log(e, 'otherss')
    let mid = e.target.dataset.fromid;
    wx.navigateTo({
      url: `/pages/others/others?mid=${mid}`
    })
  },
  // 详情
  gotoDetail (e) {
    // console.log(e, 'idd')
    let id = e.currentTarget.dataset.qid;
    let stat = e.currentTarget.dataset.stat;
    if (stat*1===4) {
      Api.wxShowToast('该话题已被发起人删除', 'none', 2000);
    } else {
      wx.navigateTo({
        url: `/pages/details/details?id=${id}`
      })
    }
    // let my = e.currentTarget.dataset.my;
    
  }
})