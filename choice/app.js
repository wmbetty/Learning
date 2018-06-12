//app.js
const Api = require('wxapi/wxApi');
const backApi = require('utils/util');

App({
  globalData: {
    userInfo: null,
    access_token: '',
    getUserInfo: null
  },
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);
    let that = this;

    // 登录
    wx.login({
      success: function(res) {
        let reqData = {};
        let code = res.code;
        if (code) {
          reqData.code = code;
          Api.wxRequest(backApi.loginApi,'POST',reqData,(res)=>{
            let acc_token = res.data.data.data.access_token;
            if (acc_token) {
              that.globalData.access_token = acc_token;
            };
            // console.log(res, 'dd')
            // for (let item of datas) {
            //   item.choose_left = false;
            //   item.choose_right = false;
            //   item.choose1 = that.textNumTest(item.choose1);
            //   item.choose2 = that.textNumTest(item.choose2);
            // }
            // that.setData({
            //   chooseData: datas
            // })
          })
        }
      }
    });

    // 获取用户信息
    // let wxGetSetting = Api.wxGetSetting()
    // wxGetSetting().then(res => {
    //   console.log(res, 'ress')
    // })
    // wx.getSetting({
      // success: res => {
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   wx.getUserInfo({
        //     success: res => {
        //       // 可以将 res 发送给后台解码出 unionId
        //       this.globalData.userInfo = res.userInfo
        //
        //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //       // 所以此处加入 callback 以防止这种情况
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     }
        //   })
        // }
      // }
    // })
    //        "iconPath": "images/home.png",
  }
})