// pages/previewDetail/previewDetail.js
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
    spotId: '', //地点id
    spotDetail: {},
    intros: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.item)
    console.log(item, 'item')
    let id = (item.id).substring(5)
    let sid = wx.getStorageSync('sid')
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url+'/baike/baikeView?sid=' + sid
      let postData = {
        'id':id,
        'app':appValue,
        'platform':platform,
        'ver':ver
      }
      wxJs.postRequest(url, postData, (res) => {
        let details = res.data.result.Baike
        let that = this
        let intros = details.content.replace(/(^\s*)|(\s*$)/g, "")
        that.setData({
          spotDetail: details,
          intros: intros
        })
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
  
  }
})