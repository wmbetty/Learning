import wxJs from '../../util/wxjs'
var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var tempAreaList = []

Page({
  data:{
    xid:'',
    sid:'',
    searchSpot:'',
    spotListData:[],
    areaList: [], //列表数据
    lastAreaList: [],
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
    wxJs.showLoading('加载中')
    wxJs.postRequest(url, postData, (res) => {
      let resData = res.data //接口返回数据
      if (that.data.pageId <= 1 && resData.result && resData.result['Area.list'].length > 0) {
        wx.hideLoading();
        that.setData({
          areaList: resData.result['Area.list'],
          lastAreaList: resData.result['Area.list']
        })
      }
      if (that.data.pageId > 1 && resData.result && resData.result['Area.list'].length > 0) {
        wx.hideLoading();
        tempAreaList = resData.result['Area.list']
        let list = that.data.lastAreaList
        that.setData({
          lastAreaList: list.concat(tempAreaList)
        })
      }
      if ((!resData.result || resData.result['Area.list'].length === 0) && that.data.pageId > 1) {
        wx.hideLoading();
        that.setData({
          hasMore: false
        })
      }
    })
  },

  onLoad:function(option){
    let that = this;
    let xid = option.xid;
    let sid = '';
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
        
        that.getList(url, postData)

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
    let tabIndex = e.target.dataset.index;
    let pageId = 1;
    that.setData({
      tabIndex: tabIndex,
      pageId: pageId,
      pname: pname
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

  //滚动到底部触发事件
  searchScrollLower (e) {
    let that = this;
    if (e.timeStamp-this.data.timeStamp<3000) {return}
    this.setData({
      timeStamp:e.timeStamp
    });  
    if(that.data.hasMore){
      let pageId = that.data.pageId + 1
      that.setData({
        pageId: pageId
      })

      let url = that.data.listUrl
        let postData = {
          'mtype':'',
          'destiPath':'',
          'pname': that.data.pname,
          'showType':'ShowList',
          'pageId':that.data.pageId,
          'size':that.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        }

      that.getList(url, postData)
    } else {
      wxJs.showToast('数据已全部加载')
    }
  }
})