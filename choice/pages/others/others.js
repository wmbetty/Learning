// pages/others/others.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
// const app = getApp();
// let token = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    myPublish: [],
    totalCount: 0,
    totalPage: '',
    currPage: '',
    viewHeight: 0,
    mid: '',
    token: ''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    backApi.getToken().then(function(response) {
      let token = response;
      let infoApi = backApi.othersInfo+token;
      let otherPublishQues = backApi.otherPublishQues+token;
      let mid = options.mid;
      that.setData({mid:mid,token:token});
      Api.wxRequest(infoApi,'GET',{mid:mid},(res)=> {
        let datas = res.data.data;
        if (datas.id) {
          that.setData({
            userInfo: datas
          });
          Api.wxRequest(otherPublishQues,'GET',{mid:mid,page:1},(res)=> {
            if (res.data.status*1===200 && res.data.data.length) {
              let myPublish = res.data.data;
              let totalPage = res.header['X-Pagination-Page-Count'];
              let currPage = res.header['X-Pagination-Current-Page'];
              let totalCount = res.header['X-Pagination-Total-Count'];
              that.setData({
                totalPage: totalPage,
                currPage: currPage,
                totalCount: totalCount,
                myPublish: myPublish
              })
            }
          })
        } else {
          Api.wxShowToast('获取信息失败', 'none', 2000);
        }
      })
    })
  },
  // 详情
  gotoDetail (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`
    })
  },


  onPageScroll (e) {
    if (e.scrollTop*1>=this.data.viewHeight/3) {
      wx.setNavigationBarColor({
        frontColor:'#ffffff',
        backgroundColor:'#E64340'  
      })
    } else {
      wx.setNavigationBarColor({
        frontColor:'#ffffff',
        backgroundColor:'#d7d7d9'  
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let currPage = that.data.currPage*1+1;
    let myPublish = that.data.myPublish;
    let token = that.data.token;
    let otherPublishQues = backApi.otherPublishQues+token;
    let totalPage = that.data.totalPage*1;
    let mid = that.data.mid;
    if (totalPage>1 && currPage <= totalPage) {
      Api.wxRequest(otherPublishQues, 'GET', {page:currPage,mid:mid}, (res)=> {
        if (res.data.status*1 === 200) {
          let pubs = res.data.data;
          that.setData({
            myPublish: myPublish.concat(pubs),
            currPage: currPage
          })
        }
      })
    } else {
      Api.wxShowToast('没有更多数据了', 'none', 2000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})