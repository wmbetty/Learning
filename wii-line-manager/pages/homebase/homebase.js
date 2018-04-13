var app = getApp();
var util = require('../../util/util.js');
Page({
	data: {
    sid:'',
    xchSn:'',
    xid:'',
    rid:'',
    lng:'',
    lat:'',
    userId:'',
    pageId:1,
    size:5,
    height:0,
    dairyListData:[],
    hasMore:true,
    indicatorDots: true,
    autoplay: false,
    projectData:{},
    tripStatus:['未提交','待确认','待支付','待支付','已付款','待出发','进行中','已完成','已评价','已关闭'],
    itemListData:[
      {text:'游客位置',imgsrc:'../../dist/images/home_icon1.png',name:'visitorPosition',bgcolor:'#49cce4',isEnd:true},
      {text:'公告栏',imgsrc:'../../dist/images/home_icon2.png',name:'announcement',bgcolor:'#fd8881',isEnd:true},
      {text:'导游日志',imgsrc:'../../dist/images/home_icon3.png',name:'lineDairy',bgcolor:'#f8b55d',isEnd:true},
      {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde',isEnd:true},
      {text:'成员名单',imgsrc:'../../dist/images/home_icon6.png',name:'personList',bgcolor:'#8ad13e',isEnd:true},
      {text:'分房',imgsrc:'../../dist/images/home_icon7.png',name:'shareRoom',bgcolor:'#f8b55d',isEnd:true},
      {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde',isEnd:true},
      {text:'行程二维码',imgsrc:'../../dist/images/home_icon17.png',name:'xchQrcode',bgcolor:'#8ad13e',isEnd:true},
      {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3',isEnd:true},
      {text:'紧急事件',imgsrc:'../../dist/images/home_icon11.png',name:'emergency',bgcolor:'#fd8881',isEnd:true},
      {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4',isEnd:true}
    ],
    itemListData1:[
      {text:'导游位置',imgsrc:'../../dist/images/home_icon1.png',name:'touristPosition',bgcolor:'#49cce4',isEnd:true},
      {text:'出团说明',imgsrc:'../../dist/images/home_icon5.png',name:'groupIntro',bgcolor:'#a59cde',isEnd:true},
      {text:'日程安排',imgsrc:'../../dist/images/home_icon9.png',name:'schedulePlan',bgcolor:'#5baef3',isEnd:true},
      {text:'记账',imgsrc:'../../dist/images/home_icon8.png',name:'costList',bgcolor:'#a59cde',isEnd:true},
      {text:'我的房号',imgsrc:'../../dist/images/home_icon16.png',name:'myRoom',bgcolor:'#f8b55d',isEnd:true},
      {text:'分享片刻',imgsrc:'../../dist/images/home_icon15.png',name:'tourDairyDetailEdit',bgcolor:'#49cce4',isEnd:true}
    ],
    isClosePositionBtn:false,
    isOpenPositionBtn:false,
    isFinishProjectBtn:false,
    isStartProjectBtn:true,
    isCloseProjectBtn:true,
    isShowBtnBox:true
	},
  onLoad: function(option) {
    var that = this;
    var sid = '';
    var xid = option.xid;
    var rid = option.rid;
    var xchSn = option.xchSn;
    var userId = '';
    var lat = '';
    var lng = '';
    try {
      sid = wx.getStorageSync('sid');
      userId = wx.getStorageSync('userId');
      lat = wx.getStorageSync('current_lat');
      lng = wx.getStorageSync('current_lng');
      if (sid=='') {
        wx.reLaunch({
          url: "../login/login"
        })
      }else{
        this.setData({
          sid:sid,
          xid:xid,
          xchSn:xchSn,
          userId:userId,
          lat:lat,
          lng:lng,
          rid:rid
        });
      }
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          var a = res.windowHeight;
          that.setData({
              height: a
          })
        }
      })
    } catch (e) {}
  },
  onShow:function(){
    var that = this;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.request({
      url: app.globalData.url+'/xchBase/xchBaseView?sid='+this.data.sid,
      method:'POST',
      data: {
          'xid':this.data.xid,
          'rid':this.data.userId,
          'app':appValue,
          'platform':platform,
          'ver':ver
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code=="10000") {
          var result = res.data.result['XchBase'];
          var itemListData1 = that.data.itemListData1;
          var itemListData = that.data.itemListData;
          console.log(result);
          result.startCity = result.startCity.length>6?result.startCity.substring(0,6)+'..':result.startCity;
          result.destiCity = result.destiCity.length>6?result.destiCity.substring(0,6)+'..':result.destiCity;
          result.startDate = util.getDate(Number(result.startDate));
          result.finishDate = result.finishDate.split(' ')[0];
          that.setData({
            projectData:result
          });
          if (result.tripStatus>=7) {
            for (var i = 0; i < itemListData.length; i++) {
              if (0==i||4==i||5==i||7==i||9==i) {
                itemListData[i].isEnd = false;
              }
            }
            for (var i = 0; i < itemListData1.length; i++) {
              if (0==i) {
                itemListData1[i].isEnd = false;
              }
            }
            that.setData({
              itemListData1:itemListData1,
              itemListData:itemListData,
              isShowBtnBox:false
            });
          }else{
            if (result.tripStatus<6) {
              that.setData({
                isClosePositionBtn:false,
                isOpenPositionBtn:false,
                isFinishProjectBtn:false,
                isStartProjectBtn:true,
                isCloseProjectBtn:true
              });
            }else{
              that.setData({
                isFinishProjectBtn:true,
                isStartProjectBtn:false,
                isCloseProjectBtn:false
              });
              if (result.locStatus=="0") {
                that.setData({
                  isClosePositionBtn:false,
                  isOpenPositionBtn:true
                })
              }else{
                that.setData({
                  isClosePositionBtn:true,
                  isOpenPositionBtn:false
                })
              }
            }
          };
          wx.request({
            url: app.globalData.url+'/weBlog/lvxingrijiList?sid='+that.data.sid,
            method:'POST',
            data: {
              'fid':that.data.projectData.xid,
              'pageId':1,
              'size':5,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                var result = res.data.result['WeBlog.list'];
                var pageId = ++that.data.pageId;
                if (result) {
                  for (var i = 0; i < result.length; i++) {
                    var a = util.toTimestamp(result[i].uptime);
                    var b = Date.parse(new Date())-a
                    var uptime = util.timeFormat(b);
                    result[i].uptime = uptime;
                    result[i].mcontentImage = result[i].mcontentImage.split('middle_')[1]==''?'':result[i].mcontentImage;
                  }
                  that.setData({
                    dairyListData:result,
                    pageId:pageId
                  })
                }
              }else{
                that.setData({
                  hasMore:false
                });
              }
            }
          })
        }
      }
    });
  },
  closePosition:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var locStatus = 1;
    var longitude = this.data.lng;
    var latitude = this.data.lat;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定打开位置共享？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/setXchLocStatus?sid='+that.data.sid,
            method:'POST',
            data: {
              'xid':xid,
              'locStatus':locStatus,
              'longitude':longitude,
              'latitude':latitude,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  openPosition:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var locStatus = 0;
    var longitude = this.data.lng;
    var latitude = this.data.lat;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定关闭位置共享？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/setXchLocStatus?sid='+that.data.sid,
            method:'POST',
            data: {
              'xid':xid,
              'locStatus':locStatus,
              'longitude':longitude,
              'latitude':latitude,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  finishProject:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var current = this.data.projectData.tripStatus;
    var next = 7;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定结束行程？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/xchBaseStatus?sid='+that.data.sid,
            method:'POST',
            data: {
                'xid':xid,
                'current':current,
                'next':next,
                'app':appValue,
                'platform':platform,
                'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  startProject:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var current = this.data.projectData.tripStatus;
    var next = 6;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定开始行程？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/xchBaseStatus?sid='+that.data.sid,
            method:'POST',
            data: {
                'xid':xid,
                'current':current,
                'next':next,
                'app':appValue,
                'platform':platform,
                'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  closeProject:function(e){
    var that = this;
    var xid = this.data.projectData.xid;
    var current = this.data.projectData.tripStatus;
    var next = 9;
    var appValue = app.globalData.app;
    var platform = app.globalData.platform;
    var ver = app.globalData.ver;
    wx.showModal({
      title: '提示',
      content: '确定关闭行程？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'/xchBase/xchBaseStatus?sid='+that.data.sid,
            method:'POST',
            data: {
              'xid':xid,
              'current':current,
              'next':next,
              'app':appValue,
              'platform':platform,
              'ver':ver
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code=="10000") {
                that.onShow();
              }else{
                wx.showToast({
                  title: '设置失败',
                  icon: 'fail',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
	viewItem:function(e){
    var name = e.currentTarget.dataset.id;
    var rid = '';
    var lat = wx.getStorageSync('current_lat');
    var lng = wx.getStorageSync('current_lng');

    if (name=='touristPosition') {
      if (this.data.projectData.locStatus=='0') {
        wx.showModal({
          title: '提示',
          content: '位置共享还未开启，无法查看导游位置',
          success: function(res) {
          }
        })
      }else{
        if (lat!=''&&lng!='') {
          var url = '../../pages/'+name+'/'+name+'?xid='+this.data.projectData.xid+'&xchSn='+this.data.projectData.xchSn+'&rid='+this.data.projectData.rid+'&isManager='+this.data.projectData.isManager+'&coDay='+this.data.projectData.coDay+'&startDate='+this.data.projectData.startDate;
          wx.navigateTo({
            url:url
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '获取定位失败...',
            success: function(res) {
            }
          })
        }
      }
    }else if(name=="visitorPosition"){
      if (this.data.projectData.locStatus=='0') {
        wx.showModal({
          title: '提示',
          content: '位置共享还未开启，无法查看游客位置',
          success: function(res) {
          }
        })
      }else{
        if (lat!=''&&lng!='') {
          var url = '../../pages/'+name+'/'+name+'?xid='+this.data.projectData.xid+'&xchSn='+this.data.projectData.xchSn+'&rid='+this.data.projectData.rid+'&isManager='+this.data.projectData.isManager+'&coDay='+this.data.projectData.coDay+'&startDate='+this.data.projectData.startDate;
          wx.navigateTo({
            url:url
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '获取定位失败...',
            success: function(res) {
            }
          })
        }
      }
    }else{
      var url = '../../pages/'+name+'/'+name+'?xid='+this.data.projectData.xid+'&xchSn='+this.data.projectData.xchSn+'&rid='+this.data.projectData.rid+'&isManager='+this.data.projectData.isManager+'&coDay='+this.data.projectData.coDay+'&startDate='+this.data.projectData.startDate;
      wx.navigateTo({
        url:url
      })
    }
  },
  viewDairyDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var sourceType = e.currentTarget.dataset.sourcetype;
    var targetId = e.currentTarget.dataset.targetid;
    wx.navigateTo({
      url: "../../pages/tourDairyDetail/tourDairyDetail?id="+id+"&sourceType="+sourceType+"&targetId="+targetId
    })
  },
  loadMore:function(e){
    if (!this.data.hasMore) {return}
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
        url: app.globalData.url+'/weBlog/lvxingrijiList?sid='+this.data.sid,
        method:'POST',
        data: {
          'fid':that.data.projectData.xid,
          'pageId':that.data.pageId,
          'size':that.data.size,
          'app':appValue,
          'platform':platform,
          'ver':ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.code=="10000") {
            var result = res.data.result['WeBlog.list'];
            var dairyListData = that.data.dairyListData.concat(result);
            var pageId = ++that.data.pageId;
            for (var i = 0; i < result.length; i++) {
              var a = util.toTimestamp(result[i].uptime);
              var b = Date.parse(new Date())-a
              var uptime = util.timeFormat(b);
              result[i].uptime = uptime;
              result[i].mcontentImage = result[i].mcontentImage.split('middle_')[1]==''?'':result[i].mcontentImage;
            }
            that.setData({
              dairyListData:dairyListData,
              pageId:pageId
            });
          }else{
            that.setData({
              hasMore:false
            });
          }
        }
    })
  }
})