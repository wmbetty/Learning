// pages/categotries/categotries.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');

Page({

  data: {
    categoryId: '',
    token: '',
    cateDetails: {},
    type: 1, // 1热门问题，2最新问题
    page1: 1,
    page2: 1,
    topicList1: [],
    topicList2: []
  },
  onLoad: function (options) {
    let that = this;
    let title = options.title;
    let cateId = options.id*1;
    let cateDetailsApi = backApi.cateDetailsApi+cateId;
    that.setData({categoryId: cateId});
    wx.setNavigationBarTitle({
      title: title
    });
    let type = that.data.type;
    let page1 = that.data.page1;
    let page2 = that.data.page2;
    let getQuesData1 = {
      category_id: cateId,
      type: type,
      page: page1
    };
    let getQuesData2 = {
      category_id: cateId,
      type: 2,
      page: page2
    };
    backApi.getToken().then(function(response) {
      if (response.data.status * 1 === 200) {
        let token = response.data.data.access_token;
        that.setData({token: token});
        let cateQuesApi = backApi.cateQuesApi+token;
        Api.wxRequest(cateDetailsApi,'GET',{},(res)=>{
          if (res.data.status*1===200) {
            that.setData({cateDetails: res.data.data})
          } else {
            Api.wxShowToast('分类详情获取失败~', 'none', 2000)
          }
        });
        Api.wxRequest(cateQuesApi,'GET',getQuesData1,(res)=>{
          if (res.data.status*1===200) {
            that.setData({topicList1: res.data.data})
          } else {
            Api.wxShowToast('问题数据获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(cateQuesApi,'GET',getQuesData2,(res)=>{
          if (res.data.status*1===200) {
            that.setData({topicList2: res.data.data})
          } else {
            Api.wxShowToast('问题数据获取失败~', 'none', 2000)
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
  changeTab (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    that.setData({type: type})
  }
})