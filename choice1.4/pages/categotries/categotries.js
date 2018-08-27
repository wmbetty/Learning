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
    topicList2: [],
    totalPage1: 1,
    totalPage2: 1,
    showContent: false,
    showBotomBtn1: false,
    showBotomBtn2: false,
    fixedTabHead: false,
    showDialog: false
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
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
            wx.hideLoading();
            let totalPage1 = res.header['X-Pagination-Page-Count'];
            that.setData({topicList1: res.data.data, showContent:true,totalPage1:totalPage1})

          } else {
            wx.hideLoading();
            Api.wxShowToast('问题数据获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(cateQuesApi,'GET',getQuesData2,(res)=>{
          if (res.data.status*1===200) {
            let totalPage2 = res.header['X-Pagination-Page-Count'];
            that.setData({topicList2: res.data.data,totalPage2:totalPage2})
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

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
    let that = this;
    let type = that.data.type;
    let list1 = that.data.topicList1;
    let list2 = that.data.topicList2;
    let page1 = that.data.page1*1+1;
    let page2 = that.data.page2*1+1;
    let totalPage1 = that.data.totalPage1*1;
    let totalPage2 = that.data.totalPage2*1;
    let token = that.data.token;
    let categoryId = that.data.categoryId;
    let cateQuesApi = backApi.cateQuesApi+token;
    if (type*1===1) {
      if (page1>totalPage1) {
        that.setData({showBotomBtn1:true})
      } else {
        Api.wxRequest(cateQuesApi,'GET',{category_id:categoryId,type:1,page:page1},(res)=>{
          if (res.data.status*1===200) {
            list1 = list1.concat(res.data.data)
            that.setData({topicList1: list1,page1:page1})
          } else {
            Api.wxShowToast('问题数据获取失败~', 'none', 2000)
          }
        })
      }
    } else {
      if (page2>totalPage2) {
        that.setData({showBotomBtn2:true})
      } else {
        Api.wxRequest(cateQuesApi,'GET',{category_id:categoryId,type:2,page:page2},(res)=>{
          if (res.data.status*1===200) {
            list2 = list2.concat(res.data.data)
            that.setData({topicList2: list2,page2:page2})
          } else {
            Api.wxShowToast('问题数据获取失败~', 'none', 2000)
          }
        })
      }
    }
  },

  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.cateDetails.name,
      path: `/pages/gcindex/gcindex?cname=${that.data.cateDetails.name}&cid=${that.data.cateDetails.id}`,
      success() {
        Api.wxShowToast('分享成功~', 'none', 2000);
      },
      fail() {},
      complete() {

      }
    }
  },
  changeTab (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.id) {
      that.setData({type: type})
    } else {
      that.setData({showDialog: false})
    }
  },
  // 去广场
  gotoMain () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.id) {
      wx.navigateTo({
        url: '/pages/main/main'
      })
    } else {
      that.setData({showDialog: false})
    }
  },
  gotoDetail (e) {
    let that = this;
    let qid = e.currentTarget.dataset.qid;
  // &my=${my}
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.id) {
      wx.navigateTo({
        url: `/pages/details/details?id=${qid}`
      })
    } else {
      that.setData({showDialog: false})
    }
  },
  gotoOther (e) {
    let that = this;
    let mid = e.currentTarget.dataset.mid;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.id) {
      if (mid*1===userInfo.id*1) {
        wx.reLaunch({url:`/pages/mine/mine`})
      } else {
        wx.navigateTo({
          url: `/pages/others/others?mid=${mid}`
        })
      }
    } else {
      that.setData({showDialog: false})
    }
  },
  onPageScroll (e) {
    let that = this;
    if (e.scrollTop*1>=200) {
      that.setData({fixedTabHead:true});
    }
    if (e.scrollTop*1<=116) {
      that.setData({fixedTabHead:false});
    }
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
                    Api.wxShowToast('授权成功，可进行操作了', 'none', 2000);
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})