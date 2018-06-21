// pages/notedetail/notedetail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    msg: '',
    time: '',
    title: '',
    option1: '',
    option2: '',
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let msg = options.msg;
    let item = JSON.parse(options.item);
    // console.log(msg, item)
    that.setData({
      item: item
    })
    if (msg != null) {
      that.setData({msg: msg})
      let msgs=msg.replace(/<\/?.+?>/g,"");
      let msgArr = msgs.split(" ");
      let reg = /\{{(.+?)\}}/g;
      let lastMsgArr = [];
      for (let item of msgArr) {
        lastMsgArr.push(item.match(reg));
      }
      console.log(lastMsgArr, 'arrs')
      that.setData({
        title: msgArr[0],
        option1: msgArr[1],
        option2: msgArr[2]
      })
      
    }
      
    if (item.id) {
      let time = item.updated_time;
      that.setData({
        time: time,
        content: item.template.content
      })
    }
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
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
  
  }
})