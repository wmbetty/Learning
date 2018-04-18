// pages/previewDetail/previewDetail.js
import wxJs from '../../util/wxjs'
import util from '../../util/util'

var app = getApp();
var appValue = app.globalData.app;
var platform = app.globalData.platform;
var ver = app.globalData.ver;
var loveTap = 0;
var innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spotId: '', //地点id
    spotDetail: {},
    intros: '',
    winHeight: '',
    sid: '',
    detailData: {},
    coLove: 0,
    bklove: '',
    canPlay: false,
    distance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
    wxJs.getSystemInfo((res) => {
      // 可使用窗口宽度、高度
      let windowHeight = res.windowHeight
      that.setData({
        // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
        winHeight: windowHeight
      })
    })

    // 获取点赞状态
    wx.getStorage({
      key: 'beloved',
      success: (res) => {
        if (res.data === true) {
          that.setData({
            bklove: true
          })
        } else{
          that.setData({
            bklove: false
          })
        }
      }
    })
    let item = JSON.parse(options.item)
    let id = (item.id).substring(5)
    let sid = wx.getStorageSync('sid')
    if (sid === '') {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    } else {
      let url = app.globalData.url+'/baike/baikeView?sid=' + sid
      let postData = {
        'id':id,
        'app':appValue,
        'platform':platform,
        'ver':ver
      }
      that.setData({
        sid: sid,
        detailUrl: url,
        detailData: postData
      })
      that.getDetails(url, postData)
    }
  },

  // 点击评论
  goComment (e) {
    let spot = e.currentTarget.dataset.spot
    wx.navigateTo({
      url: '/pages/spotComment/spotComment?spot=' + JSON.stringify(spot),
    })
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
    innerAudioContext.pause();
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
  
  },

  getDetails (url, postData) {
    let that = this
    wxJs.postRequest(url, postData, (res) => {
      let details = res.data.result.Baike
      let intros = details.content.replace(/(^\s*)|(\s*$)/g, "")
      let coLove = details.coLove
      that.setData({
        spotDetail: details,
        intros: intros,
        coLove: coLove
      })

      // 获取当前经纬度
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          let dis = util.getDistance(res.latitude, res.longitude, details.latitude, details.longitude)
          console.log(dis, 'dis')
          if (isNaN(dis)) {
            dis = 0
          }
          that.setData({
            distance: dis
          })
        }
      })

      let voiceData = [];
      let voicePathData = [];
      let voiceContent = details.content;
      for (let i = 0; i < Math.ceil(voiceContent.length/400); i++) {
        let a = voiceContent.substring(400*i,400*(i+1));
        voiceData.push(a);
      }

      wx.request({
        url: 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=d6cmh8XMfoNbdXIjz3jezuNNBFqoZYaV&client_secret=TuzFujQG7ZqHKlXYGsob5CFlCyhaz1B5',
        method:'GET',
        success: function(res) {
          let token = res.data.access_token;
          try{
            playAudios(voiceData,token,{
              success:reses=>{
                let index = 0;
                innerAudioContext.src = reses[index];
                console.log(innerAudioContext.src, 'srcccc')
                innerAudioContext.onPlay(()=>{
                  console.log(reses[index]);
                });
                innerAudioContext.autoplay = false;
                innerAudioContext.onEnded(() => {
                  if (index >= (reses.length-1)) {
                    that.setData({
                      canPlay: false
                    })
                  }
                });
              }
            })
          }catch(e){console.log(e);}
        }
      })

    })
  },

  // 点赞
  bkLove() {
    loveTap++
    let that = this
    let sourceId = that.data.spotDetail.id
    let targetId = that.data.spotDetail.myId
    let url = app.globalData.url + '/bkLove/bkLove?sid=' + that.data.sid
    let postData = {
      'sourceType': 'Baike',
      'sourceId': sourceId * 1,
      'realType': '',
      'realId': 0,
      'targetId': targetId * 1,
      'app': appValue,
      'platform': platform,
      'ver': ver
    }
    wxJs.postRequest(url, postData, (res) => {
      let data = res.data.result.Delete
      let bklove = that.data.bklove
      let coLove = that.data.coLove * 1
      setTimeout(() => {
        if (loveTap % 2 === 0 && coLove > 0 && data) {
          that.setData({
            coLove: coLove - 1,
            bklove: false
          })
          wx.setStorage({
            key: "beloved",
            data: false
          })
        }
        if (loveTap % 2 !== 0 && data) {
          that.setData({
            coLove: coLove + 1,
            bklove: true
          })
          wx.setStorage({
            key: "beloved",
            data: true
          })
        }
      }, 500)
    })
  },

  // 播放语音
  startVoice () {
    if (!this.data.canPlay) {
      this.setData({
        canPlay:true
      })
      innerAudioContext.play();
    }
  },

  // 停止语音播放
  stopVoice:function(e){
    innerAudioContext.pause();
    this.setData({
      canPlay:false
    })
  }
})

// 语音播放
function playAudio (audio,token) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: 'https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=356982065156001&tok='+token+'&tex='+audio,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        }
      },
      fail:(res) => {
        console.log('downloadFile fail');
      }
    }).onProgressUpdate((res) => {
      if (res.progress === 100) {
        console.log('progress'+Date.parse(new Date()));
      }
    })
  })
}

function playAudios(audioData = [], token = '', opts = {}) {
  let promises = []
  audioData.forEach(audio => {
    promises.push(playAudio(audio,token))
  })
  function noop() {}
  Promise.all(promises).then(opts.success || noop).catch(opts.fail || noop)
}