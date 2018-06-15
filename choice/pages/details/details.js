// pages/details/details.js
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';
let qid = '';

Page({
  data: {
    details: {},
    userInfo: {},
    leftPercent: 0.36,
    isLeft: false,
    isRight: false,
    showMask: false,
    isShare: false,
    isDelete: false,
    winHeight: 0,
    quesId: '',
    maskHidden: false,
    path2:"../../images/my_bg.jpg",
  },
  textNumTest (text) {
    let chineseReg = /[\u4E00-\u9FA5]/g;
    if (chineseReg.test(text)) {
      if (text.match(chineseReg).length >= 30) {  //返回中文的个数  
        text = text.substring(0, 29) + "...";
        return text; 
      } else {
        return text
      } 
    }
  },
  onLoad: function (options) {
    qid = options.id;
    let that = this;
    setTimeout(()=>{
      token = app.globalData.access_token;
      let detailUrl = backApi.quesDetail+qid;
      let myChooseTagApi = backApi.myChooseTagApi+token;
      Api.wxRequest(detailUrl,'GET',{},(res)=>{
        if (res.data.data.id) {
          that.setData({
            details: res.data.data,
            quesId: res.data.data.id
          })
          if (res.data.data.member) {
            that.setData({
              userInfo: res.data.data.member
            })
          }
        } else {
          Api.Api.wxShowToast('网络错误，请重试', 'none', 2000);  
        }
      })
      Api.wxRequest(myChooseTagApi,'GET',{qid:qid},(res)=> {
        if (res.data.status*1===200) {
          // console.log(res.data, '1122')
          if (res.data.data.choose*1===1) {
            that.setData({
              isLeft: true
            })
          } else {
            that.setData({
              isRight: true
            })
          }
        }
      })
    }, 1200);
    
    // let leftText = that.textNumTest(that.data.details.option1);
    // let rightText = that.textNumTest(that.data.details.option2);
    // that.setData({
    //   details.option1: leftText,
    //   rightChoiceText: rightText
    // })
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({winHeight: res.windowHeight});
      }
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {
    let that = this;
    let questId = that.data.quesId;
    return {
      title: '有选象 不纠结',
      path: `/pages/main/main?qid=${questId}`,
      success() {},
      fail() {},
      complete() { }
    }
  },
  onPageScroll () {
    wx.setNavigationBarTitle({
      title: "详情"
    })
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor:'#E64340'  
    })
  },
  gotoShare (e) {
    this.setData({
      isShare: true,
      isDelete: false,
      showMask: true
    })
  },
  cancelShare () {
    this.setData({
      showMask: false
    })
  },
  gotoDelete () {
    this.setData({
      isDelete: true,
      isShare: false,
      showMask: true
    })
  },
  deleteChoice () {
    this.setData({
      showMask: false,
      maskHidden: true
    })
    Api.wxShowModal('', '删除后不可恢复，是否确认删除？', true, (res) => {
      console.log(res)
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
    let that = this;
    that.setData({
      showMask: false,
      maskHidden: true
    })
    let shareQues = that.data.details.question;
    let chineseReg = /[\u4E00-\u9FA5]/g;
    let shareTitle1 = '';
    let shareTitle2 = '';
    var context = wx.createCanvasContext('mycanvas');
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 46, 375, 600)
    that.drawRoundRect(context, 0, 46, 375, 600, 8);
    var path1 = that.data.details.member.avatar;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = that.data.path2;

    if (chineseReg.test(shareQues)) {
      if (shareQues.match(chineseReg).length > 15) {  //返回中文的个数
        shareTitle1 = shareQues.substring(0, 14);
        shareTitle2 = shareQues.substring(15,shareQues.length-1);
        context.setFontSize(20);
        context.setFillStyle('#62559D');
        context.setTextAlign('center');
        context.fillText(shareTitle1, 185, 280);
        context.stroke();
        context.setFontSize(20);
        context.setFillStyle('#62559D');
        context.setTextAlign('center');
        context.fillText(shareTitle2, 185, 314);
        context.stroke();
      } else {
        context.setFontSize(20);
        context.setFillStyle('#62559D');
        context.setTextAlign('center');
        context.fillText(shareQues, 185, 280);
        context.stroke();
      }
    }

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
  cancelPoster () {
    let that = this;
    that.setData({
      maskHidden: false
    })
  },
  shareToFriends () {
    this.setData({
      showMask: false,
      maskHidden: true
    })
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
  }
})