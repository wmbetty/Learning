// pages/votemsg/votemsg.js
const Api = require('../../wxapi/wxApi');
const backApi = require('../../utils/util');
const app = getApp();
let token = '';

Page({
  data: {
    noData: false,
    showBlue: false,
    noticeLists: [],
    noDatas: false,
    totalPage: '',
    currPage: ''
  },
  onLoad: function (options) {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let noticeMsg = backApi.noticeMsg+token;
      wx.showLoading({
        title: '加载中',
      });
      Api.wxRequest(noticeMsg,'GET',{},(res)=> {
        if (res.data.status*1===200) {
          wx.hideLoading();
          let totalPage = res.header['X-Pagination-Page-Count'];
          let currPage = res.header['X-Pagination-Current-Page'];
          let totalCount = res.header['X-Pagination-Total-Count'];
          that.setData({
            totalPage: totalPage,
            currPage: currPage
          })
          let datas = res.data.data || [];
          if (datas.length>0) {
            for (let item of datas) {
              item.updated_time = item.updated_time;
            }
            that.setData({
              noticeLists: datas
            })
          } else {
            that.setData({
              noData: true
            })
          }
        }
        
      })
    }, 10)
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
    
  },
  onReady: function () {},
  onShow: function () {
    setTimeout(()=>{
      let readNoticeApi = backApi.readNoticeApi+token;
      Api.wxRequest(readNoticeApi,'PUT',{},(res)=> {
        console.log(res.data, 'read');
      })
    }, 10)
  },
  onHide: function () {
    
  },
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    let that = this;
    let currPage = that.data.currPage*1+1;
    let noticeLists = that.data.noticeLists;
    let noticeMsg = backApi.noticeMsg+token;
    let totalPage = that.data.totalPage*1;
    if (totalPage>1 && currPage <= totalPage) {
      Api.wxRequest(noticeMsg, 'GET', {page:currPage}, (res)=> {
        if (res.data.status*1 === 200) {
          let pubs = res.data.data;
          that.setData({
            noticeLists: noticeLists.concat(pubs),
            currPage: currPage
          })
        }
      })
    } else {
      Api.wxShowToast('没有更多数据了', 'none', 2000);
    }
  },
  onShareAppMessage: function () {},
  onPageScroll () {
    // wx.setNavigationBarTitle({
    //   title: "通知"
    // })
    // wx.setNavigationBarColor({
    //   frontColor:'#ffffff',
    //   backgroundColor:'#E64340'  
    // })
  },
  gotoDetails (e) {
    // console.log(e, 'notededdd')
    let msg = e.currentTarget.dataset.msg;
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: `/pages/notedetail/notedetail?msg=${msg}&item=${item}`
    })
  }
})