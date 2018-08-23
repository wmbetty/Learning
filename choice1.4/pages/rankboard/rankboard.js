// pages/rankboard/rankboard.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');

Page({
  data: {
    isWeek: true,
    type: 1,
    isMonth: false,
    isAllRank: false,
    isWeekUp: false,
    isMonthUp: false,
    token: '',
    page1: 1,
    page2: 1,
    page3: 1,
    page4: 1,
    page5: 1,
    list1: [],
    list2: [],
    list3: [],
    list4: [],
    list5: [],
    showContent: false
  },

  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let rankData1 = {
      type: 1,page: that.data.page1
    };
    let rankData2 = {
      type: 2,page: that.data.page2
    };
    let rankData3 = {
      type: 3,page: that.data.page3
    };
    let rankData4 = {
      type: 4,page: that.data.page4
    };
    let rankData5 = {
      type: 5,page: that.data.page5
    };
    backApi.getToken().then(function(response) {
      if (response.data.status * 1 === 200) {
        wx.hideLoading();
        let token = response.data.data.access_token;
        that.setData({token: token});
        let rankApi = backApi.rankApi+token;
        Api.wxRequest(rankApi,'GET',rankData1,(res)=>{
          if (res.data.status*1===200) {
            that.setData({list1: res.data.data,showContent:true})
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(rankApi,'GET',rankData2,(res)=>{
          if (res.data.status*1===200) {
            that.setData({list2: res.data.data})
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(rankApi,'GET',rankData3,(res)=>{
          if (res.data.status*1===200) {
            that.setData({list3: res.data.data})
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(rankApi,'GET',rankData4,(res)=>{
          if (res.data.status*1===200) {
            that.setData({list4: res.data.data})
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
        Api.wxRequest(rankApi,'GET',rankData5,(res)=>{
          if (res.data.status*1===200) {
            that.setData({list5: res.data.data})
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })

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
    let that = this;
    let page1 = that.data.page1*1+1;
    let page2 = that.data.page2*1+1;
    let page3 = that.data.page3*1+1;
    let page4 = that.data.page4*1+1;
    let page5 = that.data.page5*1+1;
    let list1 = that.data.list1;
    let list2 = that.data.list2;
    let list3 = that.data.list3;
    let list4 = that.data.list4;
    let list5 = that.data.list5;
    let type = that.data.type;
    let isWeek = that.data.isWeek;
    let isMonth = that.data.isMonth;
    let isAllRank = that.data.isAllRank;
    let rankApi = backApi.rankApi+that.data.token;
    if (isAllRank) {
      Api.wxRequest(rankApi,'GET',{type:5,page:page5},(res)=>{
        if (res.data.status*1===200) {
          if (res.data.data.length===0) {
            // 没有更多了
            that.setData({noList5:true})
          } else {
            list5 = list5.concat(res.data.data);
            that.setData({list5: list5,page5: page5})
          }
        } else {
          Api.wxShowToast('数据获取失败~', 'none', 2000)
        }
      })
    }
    if (isMonth) {
      if (type*1===3) {
        Api.wxRequest(rankApi,'GET',{type:3,page:page3},(res)=>{
          if (res.data.status*1===200) {
            if (res.data.data.length===0) {
              // 没有更多了
              that.setData({noList3:true})
            } else {
              list3 = list3.concat(res.data.data);
              that.setData({list3: list3,page3: page3})
            }
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
      }
      if (type*1===4) {
        Api.wxRequest(rankApi,'GET',{type:4,page:page4},(res)=>{
          if (res.data.status*1===200) {
            if (res.data.data.length===0) {
              // 没有更多了
              that.setData({noList4:true})
            } else {
              list4 = list4.concat(res.data.data);
              that.setData({list4: list4,page4: page4})
            }
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
      }
    }
    if (isWeek) {
      if (type*1===1) {
        Api.wxRequest(rankApi,'GET',{type:1,page:page1},(res)=>{
          if (res.data.status*1===200) {
            if (res.data.data.length===0) {
              // 没有更多了
              that.setData({noList1:true})
            } else {
              list1 = list1.concat(res.data.data);
              that.setData({list1: list1,page1: page1})
            }
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
      }
      if (type*1===2) {
        Api.wxRequest(rankApi,'GET',{type:2,page:page2},(res)=>{
          if (res.data.status*1===200) {
            if (res.data.data.length===0) {
              // 没有更多了
              that.setData({noList2:true})
            } else {
              list2 = list2.concat(res.data.data);
              that.setData({list2: list2,page2: page2})
            }
          } else {
            Api.wxShowToast('数据获取失败~', 'none', 2000)
          }
        })
      }
    }
  },

  onShareAppMessage: function () {
  
  },
  changeTab (e) {
    let that = this;
    let title = e.currentTarget.dataset.title;
    let isWeek = that.data.isWeek;
    let isMonth = that.data.isMonth;
    let isWeekUp = that.data.isWeekUp;
    let isMonthUp = that.data.isMonthUp;

    if (isWeek) {
      if (isWeekUp) {
        that.setData({isWeekUp: false,type:1})
      } else {
        that.setData({isWeekUp: true,type:2})
      }
    }
    if (isMonth) {
      if (isMonthUp) {
        that.setData({isMonthUp: false,type:3})
      } else {
        that.setData({isMonthUp: true,type:4})
      }
    }

    if (title==='isWeek' && !isWeek && !isWeekUp) {
      if (isMonthUp) {
        that.setData({isMonthUp: true,type:4})
      } else {
        that.setData({isMonthUp: false,type:3})
      }
      that.setData({isWeek: true,isMonth:false,isAllRank:false,type: 1})
    }
    if (title==='isWeek' && !isWeek && isWeekUp) {
      if (isMonthUp) {
        that.setData({isMonthUp: true,type:4})
      } else {
        that.setData({isMonthUp: false,type:3})
      }
      that.setData({isWeek: true,isMonth:false,isAllRank:false,type: 2})

    }
    if (title==='isMonth' && !isMonth && !isMonthUp) {
      if (isWeekUp) {
        that.setData({isWeekUp: true,type:2})
      } else {
        that.setData({isWeekUp: false,type:1})
      }
      that.setData({isMonth: true,isWeek:false,isAllRank:false,type: 3})
    }
    if (title==='isMonth' && !isMonth && isMonthUp) {
      if (isWeekUp) {
        that.setData({isWeekUp: true,type:2})
      } else {
        that.setData({isWeekUp: false,type:1})
      }
      that.setData({isMonth: true,isWeek:false,isAllRank:false,type: 4})
    }

    if (title==='isAllRank') {
      if (isWeekUp) {
        that.setData({isWeekUp: true,type:2})
      } else {
        that.setData({isWeekUp: false,type:1})
      }
      if (isMonthUp) {
        that.setData({isMonthUp: true,type:4})
      } else {
        that.setData({isMonthUp: false,type:3})
      }
      that.setData({isAllRank: true,isMonth: false,isWeek:false,type:5})
    }
  },
  // 去问题详情
  goQuesDetails (e) {
    let id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/pages/details/details?id=${id}`
      })
    } else {
      Api.wxShowToast('该问题为空~', 'none', 2000)
    }
  },
  gotoOthers (e) {
    let mid = e.currentTarget.dataset.mid;
    let userInfo = wx.getStorageSync('userInfo', userInfo);
    if (mid*1===userInfo.id*1) {
      wx.reLaunch({url:`/pages/mine/mine`})
    } else {
      wx.navigateTo({
        url: `/pages/others/others?mid=${mid}`
      })
    }
  }
})