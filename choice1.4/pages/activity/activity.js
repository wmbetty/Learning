// pages/activity/activity.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');

Page({

  data: {
    token: '',
    actId: '',
    activity: {}
  },

  onLoad: function (options) {
    let that = this;
    backApi.getToken().then(function(response) {
      if (response.data.status * 1 === 200) {
        let token = response.data.data.access_token;
        that.setData({token: token,actId: options.id});
        let activityApi = backApi.activityApi+options.id;
        Api.wxRequest(activityApi,'GET',{},(res)=>{
          if (res.data.status*1===200) {
            that.setData({activity: res.data.data})
            wx.setNavigationBarTitle({
              title: res.data.data.title
            });
          } else {
            Api.wxShowToast('活动获取失败~', 'none', 2000)
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
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '活动',
      path: `/pages/gcindex/gcindex?actId=${that.data.actId}`,
      success() {
        Api.wxShowToast('分享成功~', 'none', 2000);
      },
      fail() {},
      complete() {

      }
    }
  },
  gotoJoin () {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  }
})