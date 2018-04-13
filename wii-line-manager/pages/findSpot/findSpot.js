import wxJs from '../../util/wxjs'
var app = getApp();

Page({
  data:{
    xid:'',
    sid:'',
    searchSpot:'',
    spotListData:[],
    areaList: [], //列表数据
    listHeight: '', //列表高度
    pageId:1,
    size:10,
    hasMore:true,
    pname: '',
    postData: {},
    listUrl: '',
    tabIndex: 0
  },

  // 获取列表数据
  getList(url, postData) {
    let that = this
    wxJs.postRequest(url, postData, (res) => {
      let resData = res.data //接口返回数据
      if (resData.code === '10000') {
        if (resData.result && resData.result['Area.list'].length > 0) {
          that.setData({
            areaList: resData.result['Area.list']
          })
        } else {
          wxJs.showToast('暂无数据')
        }
      } else {
        wxJs.showToast('网络出错了')
      }
    })
  },

  onLoad:function(option){
    let that = this;
    let xid = option.xid;
    let sid = '';
    let appValue = app.globalData.app;
    let platform = app.globalData.platform;
    let ver = app.globalData.ver;
    try {
      sid = wx.getStorageSync('sid');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        that.setData({
            sid:sid,
            xid:xid
        });
        let url = app.globalData.url+'/lxArea/lxAreaIndex?sid=' + that.data.sid
        that.setData({
          listUrl: url
        })
        let pname = that.data.pname
        let postData = {
          'mtype':'',
          'destiPath':'',
          'pname': pname,
          'showType':'ShowList',
          'pageId':that.data.pageId,
          'size':that.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        }
        
        this.getList(url, postData)

      // 获取系统信息
      wx.getSystemInfo({
        success: function (res) {
          console.log(res);
          // 可使用窗口宽度、高度
          let windowHeight = res.windowHeight
          that.setData({
            // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
            listHeight: windowHeight - 316 / 750 * 300
          })
        }
      })

      }
    } catch (e) {}
  },

  // 左侧切换
  changeSpot (e) {
    let that = this
    let pname = e.target.dataset.name
    let appValue = app.globalData.app;
    let platform = app.globalData.platform;
    let ver = app.globalData.ver;
    let tabIndex = e.target.dataset.index;
    console.log(tabIndex, 'iii')
    that.setData({
      tabIndex: tabIndex
    })

    let url = that.data.listUrl
    let postData = {
      'mtype': '',
      'destiPath': '',
      'pname': pname,
      'showType': 'ShowList',
      'pageId': that.data.pageId,
      'size': that.data.size,
      'app': appValue,
      'platform': platform,
      'ver': ver
    }
    that.getList(url, postData)
  },

  // searchBtn:function(e){
  //   var that = this;
  //   var appValue = app.globalData.app;
  //   var platform = app.globalData.platform;
  //   var ver = app.globalData.ver;
  //   wx.showLoading({
  //     title: '加载中',
  //     mask:true
  //   })
  //   this.setData({
  //     pageId:1,
  //     hasMore:true
  //   });
  //   wx.request({
  //     url: app.globalData.url+'/baike/baikeDestiHot?sid='+this.data.sid,
  //     method:'POST',
  //     data: {
  //       'mtype':'',
  //       'destiPath':'',
  //       'showType':'ShowList',
  //       'pageId':this.data.pageId,
  //       'size':this.data.size,
  //       'app':appValue,
  //       'platform':platform,
  //       'ver':ver
  //     },
  //     header: {
  //         'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function(res) {
  //       if (res.data.code=="10000") {
  //         var result = res.data.result['ShowList.list'];
  //         var pageId = ++that.data.pageId;
  //         console.log(result);
  //         that.setData({
  //           spotListData:result,
  //           pageId:pageId
  //         });
  //         wx.hideLoading();
  //       }else{
  //         that.setData({
  //           hasMore:false
  //         });
  //         wx.hideLoading();
  //         wx.showModal({
  //           title: '提示',
  //           content: '暂无相关景点，请添加',
  //           showCancel:false,
  //           success: function(res) {
  //             if (res.confirm) {
  //               console.log('用户点击确定')
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // bindSearchInput:function(e){
  //   var b = e.detail.value;
  //   this.setData({
  //     searchSpot:b
  //   });
  // },
  loadMore:function(e){
    if (!this.data.hasMore) {return}
    if (e.timeStamp-this.data.timeStamp<3000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });
    console.log(e);
    console.log(this.data.pageId);
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
        url: app.globalData.url+'/xchJingdian/xchJingdianSearch?sid='+this.data.sid,
        method:'POST',
        data: {
          'title':this.data.searchSpot,
          'pageId':this.data.pageId,
          'size':this.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
            var result = res.data.result['ShowList.list'];
            var spotListData = that.data.spotListData.concat(result);
            var pageId = ++that.data.pageId;
            that.setData({
              spotListData:spotListData,
              pageId:pageId
            });
            wx.hideLoading();
          }else{
            that.setData({
              hasMore:false,
              showLoading:false
            });
            wx.hideLoading();
          }
        }
    })
  }
})