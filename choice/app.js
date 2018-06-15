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
            // console.log(res, 'token')
            let acc_token = res.data.data.access_token;
            if (acc_token) {
              that.globalData.access_token = acc_token;
              let userInfo = wx.getStorageSync('userInfo', userInfo);
              // console.log(token, 'oooo')
              let userInfoApi = backApi.userInfo+acc_token
              if (userInfo) {
                let userData = {
                  avatarUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  country: userInfo.country,
                  city: userInfo.city,
                  language: userInfo.language,
                  province: userInfo.province,
                  gender: userInfo.gender
                }
                Api.wxRequest(userInfoApi,'PUT',userData,(res)=>{
                  console.log(res.data.status, 'sssssssss')
                })
              }
              let msgTotalApi = backApi.msgUnreadTotal+acc_token;
              Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
                // console.log(res, 'sssssssss')
                if (res.data.status*1===200) {
                  let msgTotal = res.data.data.total;
                  wx.setStorageSync('msgTotal', msgTotal);
                  if (msgTotal) {
                    setInterval(()=> {
                      Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
                        wx.setStorageSync('msgTotal', msgTotal);
                      })
                    }, 60000)
                  }
                } else {
                  // Api.wxShowToast('网络出错了', 'none', 2000);
                }
              })
            }
          })
        }
      }
    });
  },
  onShow (options) {
    // console.log(options, 'opp123')
    let scene = options.scene*1;
    
    if (scene === 1007 || scene === 1008) {
      let quesid = options.query.qid;
      wx.setStorageSync('quesid', quesid);
    } else {
      wx.setStorageSync('quesid', '');
    }
    let that = this;
    setTimeout(()=> {
      let token = that.globalData.access_token;
      
    },1000)
    // 判断是否是iPhone手机
    // let wxGetSystemInfo = Api.wxGetSystemInfo();
    // wxGetSystemInfo().then(res => {
    //   if (res.windowHeight) {
    //     this.setData({viewHeight: res.windowHeight});
    //   }
    // })
  }
 })