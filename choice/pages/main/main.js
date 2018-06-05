// pages/main/main.js
const tabBar = require('../../components/tabBar/tabBar.js');
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
    ],
    showShare: false,
    touxiang:"../../images/bg.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tabBar.tabbar("tabBar", 0, this);
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
  },
  goShare () {
    this.setData({
      showShare: true
    })
  },
  cancelShare () {
    this.setData({
      showShare: false
    })
  },
  onShareAppMessage (res) {
    let that = this;
    return {
      title: '自定义转发标题',
      success() {
        that.setData({
          showShare: false
        })
      },
      fail() {},
      complete() { }
    }
  },
  shareMoment () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 375, 667)
    var path = "../../images/bg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    // context.drawImage(path, 0, 0, 375, 183);
    var path1 = that.data.touxiang;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    // var path2 = "../../images/img2.png";
    // var path3 = "../../images/img3.png";
    // context.drawImage(path2, 126, 186, 120, 120);

    // var name = that.data.name;
    // //绘制名字
    // context.setFontSize(24);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText(name, 185, 340);
    // context.stroke();
    //绘制一起吃面标语
    context.setFontSize(20);
    context.setFillStyle('#000');
    context.setTextAlign('center');
    context.fillText("很纠结，啦啦啦", 185, 370);
    context.stroke();
    //绘制验证码背景
    // context.drawImage(path3, 48, 390, 280, 84);
    //绘制code码
    // context.setFontSize(40);
    // context.setFillStyle('#ffe200');
    // context.setTextAlign('center');
    // context.fillText(that.data.code, 185, 435);
    // context.stroke();
    // //绘制左下角文字背景图
    // context.drawImage(path4, 25, 520, 184, 82);
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("进入小程序输入朋友的邀请", 35, 540);
    // context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("码，朋友和你各自获得通用", 35, 560);
    // context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("优惠券1张哦~", 35, 580);
    // context.stroke();
    // //绘制右下角扫码提示语
    // context.drawImage(path5, 248, 578, 90, 25);
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden:true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun:function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },fail:function(res){
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    that.setData({
      maskHidden: false,
      showShare: false
    });
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.shareMoment();
      that.setData({
        maskHidden: true
      });
    }, 1000)
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