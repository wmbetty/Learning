// pages/others/others.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    myPublish: [],
    totalCount: 0,
    totalPage: '',
    currPage: '',
    viewHeight: 0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let infoApi = backApi.othersInfo+token;
      let otherPublishQues = backApi.otherPublishQues+token;
      let mid = options.mid;
      Api.wxRequest(infoApi,'GET',{mid:mid},(res)=> {
        console.log(res, 'sssss')
        let datas = res.data.data;
        // console.log(datas, 'dssss')
        if (datas.avatar) {
          that.setData({
            userInfo: datas
          })
          Api.wxRequest(otherPublishQues,'GET',{mid:mid,page:1},(res)=> {
            console.log(res, 'sssss')
            if (res.data.status*1===200 && res.data.data.length) {
              let myPublish = res.data.data;
              let totalPage = res.header['X-Pagination-Page-Count'];
              let currPage = res.header['X-Pagination-Current-Page'];
              let totalCount = res.header['X-Pagination-Total-Count'];
              that.setData({
                totalPage: totalPage,
                currPage: currPage,
                totalCount: totalCount,
                myPublish: res.data.data
              })
            }
            // let datas = res.data.data;
            // console.log(datas, 'dssss')
            // if (datas.id) {
            
            // } else {
            //   Api.wxShowToast('获取信息失败', 'none', 2000);
            // }
          })
        } else {
          Api.wxShowToast('获取信息失败', 'none', 2000);
        }
      })
      
    }, 1000)
  },
  // 详情
  gotoDetail (e) {
    // console.log(e, 'idd')
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`
    })
  },


  onPageScroll (e) {
    // console.log(e,this.data.viewHeight/3, 'eeee')
    if (e.scrollTop*1>=this.data.viewHeight/3) {
      wx.setNavigationBarColor({
        frontColor:'#ffffff',
        backgroundColor:'#E64340'  
      })
    } else {
      wx.setNavigationBarColor({
        frontColor:'#ffffff',
        backgroundColor:'#d7d7d9'  
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
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
    let that = this;
    let currPage = that.data.currPage*1+1;
    let myPublish = that.data.myPublish;
    let otherPublishQues = backApi.otherPublishQues+token;
    let totalPage = that.data.totalPage*1;
    console.log(currPage,totalPage)
    if (totalPage>1 && currPage <= totalPage) {
      Api.wxRequest(otherPublishQues, 'GET', {page:currPage}, (res)=> {
        if (res.data.status*1 === 200) {
          let pubs = res.data.data;
          // console.log(myJoin)
          that.setData({
            myPublish: myPublish.concat(pubs),
            currPage: currPage
          })
        }
      })
    } else {
      Api.wxShowToast('没有更多数据了', 'none', 2000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})