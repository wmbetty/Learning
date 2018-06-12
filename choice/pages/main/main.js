// pages/main/main.js
const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

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
    currentIndex: 0,
    numActive: false,
    choose1_orgin: 0,
    choose2_orgin: 0,
    showMask: false,
    chooseData:[],
    showShare: false,
    touxiang:"../../images/bg.png",
    path2:"../../images/my_bg.png",
    choose_left: false,
    imagePath: '',
    showDialog: false
  },
  textNumTest (text) {
    let chineseReg = /[\u4E00-\u9FA5]/g;
    if (chineseReg.test(text)) {
      if (text.match(chineseReg).length >= 30) {  //返回中文的个数  
        text = text.substring(0, 29) + "...";
        return text; 
      } else{
        return text
      }  
    }
  },
  onLoad: function (options) {
    let that = this;
    tabBar.tabbar("tabBar", 0, that);
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        that.setData({viewHeight: res.windowHeight});
      }
    })

    wx.showLoading({
      title: '加载中',
    });

    // app.js onLunch为异步事件
    setTimeout(()=>{
      token = app.globalData.access_token;
      console.log(token)
      Api.wxRequest(backApi.questions+token, 'GET', {}, (res)=>{
        // console.log(res, 'rssss')
        let datas = res.data.data;
        if (datas.length >= 0) {
          wx.hideLoading();
          that.setData({chooseData: datas});
        }
      })
    },1500)
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage () {
    let that = this;
    return {
      title: '自定义转发标题',
      success() {},
      fail() {},
      complete() { }
    }
  },
  onPageScroll () {
    wx.setNavigationBarTitle({
      title: '选象'
    });
  },
  // 到他人中心
  gotoOthers () {
    wx.navigateTo({
      url: '/pages/others/others'
    })
  },
  cancelDialog () {
    let that = this;
    that.setData({
      showDialog: false
    })
  },
  confirmDialog (e) {
    let that = this;
    that.setData({
      showDialog: false
    });
    wx.getUserInfo({
      success: (res)=>{
        let userInfo = res.userInfo;
        if (userInfo.nickName) {
          // app.globalData.userInfo = userInfo;
          wx.setStorageSync('getUserInfo', true);
          wx.setStorageSync('userInfo', userInfo);
        }
      }
    })
  },
  goVote (e) {
    let that = this;
    let getUserInfo = wx.getStorageSync('getUserInfo');
    if (!getUserInfo) {
      that.setData({
        showDialog: true
      })
    } else {
      let chooseData = that.data.chooseData;
      let choose1_orgin = that.data.choose1_orgin;
      let choose2_orgin = that.data.choose2_orgin;
      let direct = e.currentTarget.dataset.direct;
      let choose1 = e.currentTarget.dataset.item.choose1;
      let choose2 = e.currentTarget.dataset.item.choose2;
      let data_index = e.currentTarget.dataset.index;
      let qid = e.currentTarget.dataset.item.id;
      let answerApi = backApi.u_answer;
      let answerData = {
        qid: qid
      }

      // 1.判断是否投过票了
      for (let i = 0;i<chooseData.length;i++) {
        if (chooseData[i].showMask && data_index === i) {
          Api.wxShowToast('这个问题已经投过票了，下一题吧', 'none', 2000);
          that.setData({currentIndex: data_index+1});
          return false;
        }
      }
      //2.
      if (direct === 'left') {
        for (let i = 0;i<chooseData.length;i++) {
          if (data_index === i) {
            chooseData[i].choose_left = true;
            chooseData[i].showMask = true;
            let timer1 = setInterval(()=>{
              choose1_orgin++;
              chooseData[i].choose1 = choose1_orgin;
              that.setData({
                chooseData: chooseData
              })
              if(choose1_orgin >= choose1){
                clearInterval(timer1);
                chooseData[i].choose1 = choose1;
                that.setData({
                  chooseData: chooseData
                })
              }
            }, 160);
          }
        }
      }
      // 3.
      if (direct === 'right') {
        for (let i = 0;i<chooseData.length;i++) {
          if (data_index === i) {
            chooseData[i].choose_right = true;
            chooseData[i].showMask = true;
            let timer2 = setInterval(()=>{
              choose2_orgin++;
              chooseData[i].choose2 = choose2_orgin;
              that.setData({
                chooseData: chooseData
              })
              if(choose2_orgin >= choose2){
                clearInterval(timer2);
                chooseData[i].choose2 = choose2;
                that.setData({
                  chooseData: chooseData
                })
              }
            }, 160);
          }
        }
      }

      // 4.投票请求
      Api.wxRequest(answerApi+token,'POST',answerData,(res)=>{
        let status = res.data.status*1;
        if (status === 201) {
          setTimeout(() => {
            that.setData({currentIndex: data_index+1});
          },2000)
        }
      });
    }
  },
  goShare () {
    this.setData({
      showShare: true
    })
  },
  // 取消分享
  cancelShare () {
    this.setData({
      showShare: false
    })
  },
  shareToFriends () {
    this.setData({
      showShare: false
    })
  },
  // 绘制圆角矩形
  drawRoundRect(cxt, x, y, width, height, radius){   
      cxt.beginPath();   
      cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);   
      cxt.lineTo(width - radius + x, y);   
      cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);   
      cxt.lineTo(width + x, height + y - radius);   
      cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);   
      cxt.lineTo(radius + x, height +y);   
      cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);   
      cxt.closePath();   
      cxt.setFillStyle('#ffffff');
      cxt.fill();

  },
  shareToMoment () {
    var that = this;
    that.setData({
      showShare: false,
      maskHidden: true
    })
    var context = wx.createCanvasContext('mycanvas');
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, 375, 600)
    that.drawRoundRect(context, 0, 0, 375, 600, 8);
    var path1 = that.data.touxiang;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = that.data.path2;
    context.setFontSize(20);
    context.setFillStyle('#62559D');
    context.setTextAlign('center');
    context.fillText("很纠结，啦啦啦", 185, 280);
    context.stroke();

    context.setFontSize(18);
    context.setFillStyle('#888');
    context.setTextAlign('left');
    context.fillText("有选象，不纠结", 40, 360);
    context.stroke();
    context.setFontSize(18);
    context.setFillStyle('#888');
    context.setTextAlign('left');
    context.fillText("扫码给ta你的建议～", 40, 400);
    context.stroke();

    // //绘制右下角扫码提示语
    context.drawImage(path2, 248, 340, 66, 66);

    context.arc(186, 200, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 110, 100, 100); // 在刚刚裁剪的园上画图
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
  //保存至相册
  saveImageToPhotosAlbum:function(){
    if (!this.data.imagePath){
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel:false
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success:(res)=>{
        Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~', 'none', 2000)
        this.setData({
          maskHidden: false
        })
      },
      fail:(err)=>{
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          Api.wxShowToast('您之前点击了不允许保存图片到相册', 'none', 2000); 
        }
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
      that.shareToMoment();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  // 点击头像跳转
  gotoOthers () {
    wx.navigateTo({
      url: '/pages/mine/mine?&profile=other'
    })
  }
});

// 投票选择结果处理
// function countUp(that, chooseData, choosed, choose_orgin, choose) {
//   let timer = setInterval(()=>{
//     choose_orgin++;
//     choosed = choose_orgin;
//     that.setData({
//       chooseData: chooseData
//     })
//     if(choose_orgin >= choose){
//       clearInterval(timer);
//       choosed = choose;
//       that.setData({
//         chooseData: chooseData
//       })
//     }
//   }, 160);
// }