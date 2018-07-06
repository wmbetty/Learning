// pages/usercenter/usercenter.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userBaseInfo: {},
    showDialog: false,
    openType: 'openSetting',
    authInfo: '需要获取相册权限才能保存图片哦'
  },
  cancelDialog () {
    this.setData({showDialog:false})
  },
  confirmDialog () {
    wx.openSetting({
      success(settingdata) {
        if (settingdata.authSetting["scope.writePhotosAlbum"]) {
          Api.wxShowToast("获取权限成功，再次点击保存到相册",'none',2200)
         } else {
          Api.wxShowToast("获取权限失败",'none',2200)
         }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
    let that = this;
    
    setTimeout(()=> {
      token = app.globalData.access_token;
      let userBaseApi = backApi.userBaseApi+token;
      Api.wxRequest(userBaseApi,'GET',{},(res)=>{
        console.log(res,'baseeeee')
        that.setData({userBaseInfo: res.data.data})
      })

    },80)

  },
  savePhoto () {
    let that = this;
    let IMG_URL = that.data.userBaseInfo.template_url
    wx.showToast({
      title: '保存中...',
      icon: 'loading',
      duration: 2800
    });
    setTimeout(()=>{
      wx.downloadFile({
        url: IMG_URL,
        success:function(res){
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res) {
              Api.wxShowToast("保存成功~",'none',2200)
            },
            fail: function (err) {
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                that.setData({showDialog:true})
              }
              if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                that.setData({showDialog:true})
              }
            }
          })
        },
        fail:function(){
          console.log('fail')
        }
      })
  
    },2900)
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