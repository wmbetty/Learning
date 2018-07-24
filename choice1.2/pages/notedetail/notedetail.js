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
    item: {},
    opLeftRed: '',
    opRightRed: '',
    titleRed: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let msg = options.msg;
    let item = JSON.parse(options.item);
    let titleRed = '';
    let opLeftRed = '';
    let opRightRed = '';
    console.log(msg, item)
    that.setData({
      item: item
    })
    if (msg !== 'null' && item.template_type===3 && item.type===2) {
      that.setData({msg: msg})
      let msgs=msg.replace(/<\/?.+?>/g,"");
      let msgArr = msgs.split(" ");
      let reg = /\{{(.+?)\}}/g;
      let lastMsgArr = [];
      for (let i=0;i<msgArr.length;i++) {
        // if (msgArr[i].match(reg)) {
        //   // var num1=msgArr[i].split("{{")  //["deleteChild", "236737)"]
        //   // var num2=num1[1].split("}}") //["236737", ""]
        //   // // var result=num[0]
        //   // console.log(num2, 22)
        //   msgArr[i] = msgArr[i].replace(/\{{[^\)]*\}}/g,"")
        //   console.log(msgArr[i],'iii')
        // }
        // if (i=1 && msgArr[i].match(reg)) {
        //   opLeftRed = msgArr[i].substring(msgArr[i].indexOf("{{")+1,msgArr[i].indexOf("}}"));
        // }
        // if (i=2 && msgArr[i].match(reg)) {
        //   opRightRed = msgArr[i].substring(msgArr[i].indexOf("{{")+1,msgArr[i].indexOf("}}"));
        // }
        if (msgArr[i].match(reg)) {
          // console.log(msgArr[i],'iii')
          let word = msgArr[i].substring(msgArr[i].indexOf("{{")+2,msgArr[i].indexOf("}}"));
          // console.log(word,'dd')
          // `<text style="color: #E74C49;">${word}</text>`
          msgArr[i] = msgArr[i].replace(/\{{.*?\}}/g, ` ${word} `);
        }
        // lastMsgArr.push(item);
      }
      // console.log(lastMsgArr, 'arrs')
      // msgArr[0] = msgArr[0]+'<text>1111</text>';
      that.setData({
        title: msgArr[0],
        option1: msgArr[1],
        option2: msgArr[2],
        titleRed: titleRed,
        opLeftRed: opLeftRed,
        opRightRed: opRightRed
      })

    }

    if (item.id) {
      let time = item.created_time;
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
  onShareAppMessage: function (res) {
    let that = this;
    let token = that.data.token;
    let shareFriends = backApi.shareFriends+'?access-token='+token;
    if (res.from === 'menu') {
      return {
        title: '选象 让选择简单点',
        path: `/pages/main/main`,
        imageUrl:'/images/posterBg2.png',
        success() {
          Api.wxRequest(shareFriends,'POST',{},(res)=>{
            console.log(res, 'friends')
          })
        },
        fail() {},
        complete() {

        }
      }
    }
  },
})