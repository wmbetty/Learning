App({
  globalData: {
    url:'https://cx.wiicent.com',
    // url:'http://192.168.1.188:8001',
    app:'liexing',
    platform:'web',
    ver:'3'
  },
  updateGeo:function(lat,lng){
    if (lat!=''&&lng!=''){
      var that = this;
      var sid = '';
      try{
        sid = wx.getStorageSync('sid');
      }catch(e){console.log(e)}
      wx.request({
        url: this.globalData.url+'/aboutMe/unReadCount?sid='+sid,
        method:'POST',
        data: {
          'longitude':lng,
          'latitude':lat,
          'mapType':'GCJ02',
          'app':this.globalData.app,
          'platform':this.globalData.platform,
          'ver':this.globalData.ver
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code=="10000") {
          }else{
          }
        }
      });
    }
  }
})
