// pages/findSpotSearch/findSpotSearch.js
import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '', //搜索框文字
    size: 15,
    pageId: 1,
    sid: '',
    searchUrl: '',
    searchData: {},
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let sid = wx.getStorageSync('sid')
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url + '/baike/bkJingdianSearch?sid=' + sid
      let postData = {
        'pageId': that.data.pageId,
        'size': that.data.size,
        'title': '',
        'app': appValue,
        'platform': platform,
        'ver': ver
      }
      that.setData({
        sid: sid,
        searchUrl: url,
        searchData: postData
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 输入框输入文字
  searchTextChange (e) {
    let val = e.detail.value
    let that = this
    let postData = that.data.searchData
    let url = that.data.searchUrl
    postData.title = val
    that.setData({
      searchText: val,
      searchData: postData
    })
    that.getSearchList(url, that.data.searchData)
  },

  // 获取搜索列表
  getSearchList (url, data) {
    wxJs.postRequest(url, data, (res) => {
      let data = res.data.result
      let that = this
      that.setData({
        searchList: data['ShowList.list']
      })
    })
  },

  // 清除搜索框文字
  clearText () {
    this.setData({
      searchText: ''
    })
  },

  // 点击取消返回上一页
  goBack () {
    wx.navigateBack({
      delta: 1
    })
  }

})