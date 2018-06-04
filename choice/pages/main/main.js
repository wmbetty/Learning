// pages/main/main.js
const Api = require('../../wxapi/wxApi');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 2500,
    duration: 800,
    viewHeight: 0,
    numActive: false,
    choosed_persent: 0,
    noChoosed_persent: 0,
    showMask: false,
    choosedLeft: false,
    chooseData:[
      {id: 0, choosed: 0.33},
      {id: 1, choosed: 0.60},
      {id: 2, choosed: 1}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  // 到他人中心
  gotoOthers () {
    wx.navigateTo({
      url: '/pages/others/others'
    })
  },
  goVote (e) {
    let that = this;
    let direct = e.currentTarget.dataset.direct;
    let choosedItem = e.currentTarget.dataset.item.choosed * 100;
    let data_index = e.currentTarget.dataset.index;
    // console.log(data_index, 'index')
    let noChoosedItem = 100 - choosedItem;
    if (direct === 'left') {
      that.setData({
        choosedLeft: true
      })
    }
    countUp(that, choosedItem, noChoosedItem);
    that.setData({
      showMask: true
    })
  }
});

// 投票选择结果处理
function countUp(that, choosedEndVal, noChoosedEndVal) {
  let choosedTimer = setInterval(() => {
    let choosed_persent = that.data.choosed_persent * 1;
    choosed_persent = choosed_persent + 3;
    that.setData({
      choosed_persent: choosed_persent
    });
    if (choosed_persent >= choosedEndVal) {
      clearInterval(choosedTimer);
      that.setData({
        choosed_persent: choosedEndVal
      });
    }
  }, 100);
  let noChooseTimer = setInterval(() => {
    let noChoosed_persent = that.data.noChoosed_persent * 1;
    noChoosed_persent = noChoosed_persent + 3;
    that.setData({
      noChoosed_persent: noChoosed_persent
    });
    if (noChoosed_persent >= noChoosedEndVal) {
      clearInterval(noChooseTimer);
      that.setData({
        noChoosed_persent: noChoosedEndVal
      });
    }
  }, 100);
}