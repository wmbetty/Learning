//app.js

const Api = require('wxapi/wxApi');
const backApi = require('utils/util');
// let voteUnreadApi = ''

App({
  globalData: {
    userInfo: null,
    // access_token: '',
    getUserInfo: null
  },
  onLaunch: function () {
    
  },
  onShow (options) {
    // let that = this;
    // 登录
    wx.login({
      success: function(res) {
        let reqData = {};
        let code = res.code;
        if (code) {
          reqData.code = code;
          Api.wxRequest(backApi.loginApi,'POST',reqData,(res)=>{
            let acc_token = res.data.data.access_token;
            if (acc_token) {
              let userInfo = wx.getStorageSync('userInfo', userInfo);
              let userInfoApi = backApi.userInfo+acc_token;
              if (userInfo) {
                let userData = {
                  avatarUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  country: userInfo.country,
                  city: userInfo.city,
                  language: userInfo.language,
                  province: userInfo.province,
                  gender: userInfo.gender
                };
                Api.wxRequest(userInfoApi,'PUT',userData,(res)=>{
                  console.log(res.data.status, 'app.js update-user')
                })
              }


              let voteUnreadApi = backApi.voteUnreadApi+acc_token;
              let msgTotalApi = backApi.msgUnreadTotal+acc_token;

              setInterval(()=>{
                // 获取投票信息
                Api.wxRequest(voteUnreadApi,'GET',{},(res)=>{
                  if (res.data.status*1===200) {
                    if (res.data.data.vote) {
                      wx.setStorageSync('voteUnreadCount', res.data.data.vote);
                    }
                  }
                });
                // 获取通知数量
                Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
                  if (res.data.status*1===200) {
                    let msgTotal = res.data.data.total;
                    wx.setStorageSync('msgTotal', msgTotal);
                    if (msgTotal) {
                      Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
                        wx.setStorageSync('msgTotal', msgTotal);
                      })
                    }
                  }
                });
              },5500)

            }
          })
        }
      }
    });
    // 是否是通过分享进入
    let scene = options.scene*1;
    if (scene === 1007 || scene === 1008) {
      let quesid = options.query.qid;
      wx.setStorageSync('quesid', quesid);
    } else {
      wx.setStorageSync('quesid', '');
    }
    
    // 判断是否是iPhone手机
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      let model = res.model;
      if (model.indexOf('iPhone') != -1) {
        wx.setStorageSync('isIphone', true)
      }
    })
    // wx.getSetting({
    //   success: (res) => {
    //     // console.log(res, 'minemine')
    //     let authSetting = res.authSetting;
    //     let userInfoSet = authSetting["scope.userInfo"] || '';

    //     if (userInfoSet) {

    //     } else {
    //       wx.setStorageSync('userInfo', '');
    //     }
    //   }
    // })
  },
  onHide () {
  }
 })