const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';
let publishedPoint = '';
let myPoint = '';

Page({
  data: {
    showTextarea: false,
    showLeft: false,
    showRight: false,
    leftHolder: '点击输入左选项',
    rightHolder: '点击输入右选项',
    isPublish: false,
    leftText: '',
    rightText: '',
    titleText: '点击输入标题',
    showToast: false,
    winHeight: 0,
    isShare: false,
    showDialog: false,
    hasUserInfo: true,
    shareTitle: '',
    qid: 0,
    uavatar: '',
    path2:"../../images/my_bg.jpg",
    btnDis: false,
    nickname: '',
    maskHidden: false,
    showPosterView: false,
    qrcode: '',
    titleFocus: false,
    viewWidth: 0
    
  },
  onReady () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight,viewWidth:res.windowWidth});
      }
    })
  },
  txtFocus (e) {
    let that = this;
    that.setData({titleFocus:true,showTextarea:true})
  },
  cancelDialog () {
    let that = this;
    that.setData({
      showDialog: false
    })
  },
  confirmDialog (e) {
    let that = this;
    let userInfoApi = backApi.userInfo+token;
    that.setData({
      showDialog: false
    });
    wx.getUserInfo({
      success: (res)=>{
        let userInfo = res.userInfo;
        if (userInfo.nickName) {
          that.setData({
            uavatar: userInfo.avatarUrl,
            nickname: userInfo.nickName
          })
          wx.setStorageSync('userInfo', userInfo);
          Api.wxRequest(userInfoApi,'PUT',userInfo,(res)=> {
            if (res.data.status*1===200) {
              that.setData({
                hasUserInfo: true
              })
            }
          })
        }
      }
    })
  },
  onLoad: function(option) {
    let that = this;
    tabBar.tabbar("tabBar", 2, that);//0表示第一个tabbar
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        that.setData({winHeight: res.windowHeight});
      }
    })
  },
  onShow () {
    let that = this;
    setTimeout(()=> {
      token = app.globalData.access_token;
      let userInfo = wx.getStorageSync('userInfo');
      // console.log(userInfo, 'uuu1111')
      if (!userInfo.language) {
        that.setData({
          showDialog: true,
          hasUserInfo: false,
        })
      } else {
        that.setData({
          uavatar: userInfo.avatarUrl
        })
        downLoadImg(userInfo.avatarUrl, 'headerUrl');
      }
      let myInfo = backApi.myInfo+token;
      Api.wxRequest(myInfo,'GET',{},(res)=>{
        if (res.data.status*1===200) {
          myPoint = res.data.data.points;
        }
      })
    }, 200)
  },
  textFocus () {
    if (this.data.titleText === '点击输入标题') {
      this.setData({
        showTextarea: true,
        titleText: ''
      })
    }
  },
  contFocus (e) {
    let that = this;
    let direct = e.target.dataset.direct;
    let leftHolder = that.data.leftHolder;
    let rightHolder = that.data.rightHolder;
    if (direct === 'left' && leftHolder === '点击输入左选项') {
      that.setData({
        showLeft: true,
        leftHolder: ''
      })
    }
    if (direct === 'right' && rightHolder === '点击输入右选项') {
      that.setData({
        showRight: true,
        rightHolder: ''
      })
    }
  },
  titlePut (e) {
    let that = this;
    let val = e.detail.value;
    let direct = e.target.dataset.direct;
    let chineseReg = /[\u4E00-\u9FA5]/g;
    
    if (direct === 'title') {
      if (val) {
        that.setData({
          titleText: val,
          shareTitle: val
        })
        if (val.length>=30) {
          Api.wxShowToast('标题不超过30个字', 'none', 2000);
        }
        // if (chineseReg.test(val)) {
        //   if (val.match(chineseReg).length >= 15) {  //返回中文的个数  
        //     Api.wxShowToast('标题字数不超过16个汉字', 'none', 2000);    
        //   }  
        // } else {
        //   if (val.length>=26) {
        //     that.setData({
        //       titleMax: 26
        //     })
        //     Api.wxShowToast('标题字数超出限制', 'none', 2000);
        //   }
        // }
      }
    }
    if (direct === 'left') {
      if (val) {
        that.setData({
          leftText: val
        })
        if (val.length>=18) {
          Api.wxShowToast('左选项不超过18个字', 'none', 2000);
        }
        // if (chineseReg.test(val)) {
        //   if (val.match(chineseReg).length >= 18) {  //返回中文的个数  
        //     let wxShowToast = Api.wxShowToast('左选项字数不超过18个汉字', 'none', 2000);  
        //     that.setData({
        //       leftMax: 18
        //     })
        //   } else {
        //     if (val.length>=32) {
        //       that.setData({
        //         leftMax: 32
        //       })
        //       Api.wxShowToast('左选项字数超出限制', 'none', 2000);
        //     }
        //   }  
        // }
      }
    }
    if (direct === 'right') {
      if (val) {
        that.setData({
          rightText: val
        })
      }
      if (val.length>=18) {
        Api.wxShowToast('右选项不超过18个字', 'none', 2000);
      }
      // if (chineseReg.test(val)) {
      //   if (val.match(chineseReg).length >= 18) {  //返回中文的个数  
      //     let wxShowToast = Api.wxShowToast('右选项字数不超过18个汉字', 'none', 2000);  
      //     that.setData({
      //       rightMax: 18
      //     })
      //   }  
      // } else {
      //   if (val.length>=32) {
      //     that.setData({
      //       rightMax: 32
      //     })
      //     Api.wxShowToast('右选项字数超出限制', 'none', 2000);
      //   }
      // }
    }
    // 发布按钮样式
    if (that.data.titleText !== '' && that.data.leftText !== '' && that.data.rightText !== '') {
      that.setData({
        isPublish: true
      })
    } else {
      that.setData({
        isPublish: false
      })
    }
  },
  // 点击发布
  goPublish () {
    
    let publishApi = backApi.publishApi;
    let that = this;
    if (that.data.titleText === '点击输入标题' && that.data.leftText === '' && that.data.rightText === '') {
      let wxShowToast = Api.wxShowToast('请填写基本内容', 'none', 2000);
      return false;
    }
    if (that.data.titleText === '') {
      let wxShowToast = Api.wxShowToast('请填写标题', 'none', 2000);
      return false;
    }
    if (that.data.leftText === '') {
      let wxShowToast = Api.wxShowToast('请填写左选项', 'none', 2000);
      return false;
    }
    if (that.data.rightText === '') {
      let wxShowToast = Api.wxShowToast('请填写右选项', 'none', 2000);
      return false;
    }
    
    let postData = {
      question: that.data.titleText.substring(0,30),
      option1: that.data.leftText.substring(0,36),
      option2: that.data.rightText.substring(0,36)
    }
    that.setData({
      btnDis: true
    })
    Api.wxRequest(publishApi+token,'POST',postData,(res)=>{
      that.setData({
        isPublish: false
      })
      wx.showLoading({
        title: '发布中',
        mask: true
      });
      let status = res.data.status*1;
      // console.log(res,'tsss')
      if (status===200) {
        Api.wxShowToast('手速太快了吧，休息60分钟吧', 'none', 2000);
        that.setData({
          qid: res.data.data.id,
          showToast: false,
          leftHolder: '点击输入左选项',
          rightHolder: '点击输入右选项',
          titleText: '点击输入标题',
          leftText: '',
          rightText: '',
          isPublish: false,
          showTextarea: false,
          showLeft: false,
          showRight: false,
          btnDis: false
        });
        // 2s后消失
        setTimeout(() => {
          that.setData({
            showToast: false,
            hasUserInfo: false,
            isShare: true
          });
        }, 1500)
        // wx.navigateTo({
        //   url: `/pages/mine/mine`
        // })
      }
      if (status === 201) {
        publishedPoint = res.data.data.member.points;
        // console.log(publishedPoint,myPoint,'pointttt')
        wx.hideLoading();
        if (publishedPoint===myPoint) {
          Api.wxShowToast('发布成功', 'success', 2000);
          that.setData({
            qid: res.data.data.id,
            showToast: false,
            leftHolder: '点击输入左选项',
            rightHolder: '点击输入右选项',
            titleText: '点击输入标题',
            leftText: '',
            rightText: '',
            isPublish: false,
            showTextarea: false,
            showLeft: false,
            showRight: false,
            btnDis: false
          });
          // 2s后消失
          setTimeout(() => {
            that.setData({
              showToast: false,
              hasUserInfo: false,
              isShare: true
            });
          }, 1500)
          // wx.navigateTo({
          //   url: `/pages/mine/mine`
          // })
        } else {
          setTimeout(()=> {
            that.setData({
              qid: res.data.data.id,
              showToast: true,
              leftHolder: '点击输入左选项',
              rightHolder: '点击输入右选项',
              titleText: '点击输入标题',
              leftText: '',
              rightText: '',
              isPublish: false,
              showTextarea: false,
              showLeft: false,
              showRight: false,
              btnDis: false
            });
            // 请求通知消息
            let msgTotalApi = backApi.msgUnreadTotal+token
            Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
              // console.log(res, 'sssssssss')
              if (res.data.status*1===200) {
                setTimeout(()=> {
                  let msgTotal = res.data.data.total;
                  wx.setStorageSync('msgTotal', msgTotal);
                }, 100)
              } else {
                Api.wxShowToast('网络出错了', 'none', 2000);
              }
            })
  
          }, 300)
          // 2s后消失
          setTimeout(() => {
            that.setData({
              showToast: false,
              hasUserInfo: false,
              isShare: true
            });
          }, 1500)
        }
      }
    })
  },
  showMaskHidden () {
    let that = this;
    that.setData({
      maskHidden: true
    })
  },
  cancelPosters () {
    this.setData({
      isShare: false,
      maskHidden: false,
      hasUserInfo: true
    });
    setTimeout(()=>{
      wx.reLaunch({
        url: `/pages/mine/mine`
      })
    },50)
  },
  // 取消分享
  cancelShare () {
    this.setData({
      isShare: false,
      maskHidden: false,
      hasUserInfo: true
    });
    setTimeout(()=>{
      wx.reLaunch({
        url: `/pages/mine/mine`
      })
    },50)
    // wx.navigateTo({
    //   url: `/pages/details/details?id=${this.data.qid}`
    // })
  },
  onShareAppMessage () {
    let that = this;
    let questId = that.data.qid;
    let shareFriends = backApi.shareFriends+'?access-token='+token;
    // console.log(questId, 'ddd')
    return {
      title: that.data.shareTitle,
      path: `/pages/main/main?qid=${questId}`,
      imageUrl:'/images/share_card.png',
      success() {
        Api.wxRequest(shareFriends,'POST',{},(res)=>{
          console.log(res, 'friends')
        })
      },
      fail() {},
      complete() { 
        
      }
    }
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
  cancelPoster () {
    let that = this;
    that.setData({
      maskHidden: false,
      hasUserInfo: true
    })
  },
  closePoster () {
    this.setData({
      maskHidden: false
    })
    setTimeout(()=> {
      wx.navigateBack({
        delta: 1
      })
    }, 1300)
  },
  shareTomoment () {
    let that = this;
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1500
    });
    let posterApi = backApi.posterApi+token;
            let postData = {
              page:`pages/details/details`,
              scene: that.data.qid
            }
            Api.wxRequest(posterApi,'POST',postData,(res)=>{
              console.log(res,'poster')
              if (res.data.status*1===200) {
                if (res.data.data.url) {
                  setTimeout(()=>{
                    let qrcodeImg = res.data.data.url;
                    that.setData({
                      qrcode: qrcodeImg
                    })
                    downLoadImg(qrcodeImg, 'qrcodeImg');
                  },200)
                  
                }
              } else {
                Api.wxShowToast('小程序码获取失败~', 'none', 2000)
              }
            })
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      that.setData({
        maskHidden: true,
        isShare: false,
        showPosterView: true
      })

      var context = wx.createCanvasContext('mycanvas');
    
    let shareQues = that.data.shareTitle;
    let chineseReg = /[\u4E00-\u9FA5]/g;
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, 375, 667)
    var path = "../../images/posterBg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    // downLoadImg(that.data.details.member.avatar, 'headerUrl');
    context.drawImage(path, 0, 0, 375, 154);
    
    // console.log(path1,"path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    // var path2 = "/images/tx_bg.jpg";
    var path3 = "/images/my_bg.jpg";
    // var path4 = "/images/bg.png";
    // var path5 = "/images/empty_img.png";
    // context.drawImage(path2, 126, 186, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    // var name = that.data.name;
    //绘制名字
    // context.setFontSize(24);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText(that.data.nickname||'', 185, 340);
    // context.stroke();
    //绘制一起吃面标语
    if (chineseReg.test(shareQues)) {
      if (shareQues.match(chineseReg).length <= 13) {  //返回中文的个数
        context.setFontSize(26);
        context.setFillStyle('#343434');
        context.setTextAlign('center');
        context.fillText(shareQues, 185, 378);
        context.stroke();
      }
      if (shareQues.match(chineseReg).length>13 && shareQues.match(chineseReg).length <= 26) {  //返回中文的个数
        context.setFontSize(26);
        context.setFillStyle('#343434');
        context.setTextAlign('center');
        context.fillText(shareQues.substring(0,13), 185, 378);
        context.stroke();
        
        context.setFontSize(26);
        context.setFillStyle('#343434');
        context.setTextAlign('center');
        context.fillText(shareQues.substring(13,shareQues.length-1), 185, 414);
        context.stroke();
      }
      if (shareQues.match(chineseReg).length>26) {  //返回中文的个数
        context.setFontSize(26);
        context.setFillStyle('#343434');
        context.setTextAlign('center');
        context.fillText(shareQues.substring(0,13), 185, 378);
        context.stroke();
        
        context.setFontSize(26);
        context.setFillStyle('#343434');
        context.setTextAlign('center');
        context.fillText(shareQues.substring(13,26), 185, 414);

        context.stroke();
        context.setFontSize(26);
        context.setFillStyle('#343434');
        context.setTextAlign('center');
        context.fillText(shareQues.substring(26,shareQues.length-1), 185, 450);
        context.stroke();
      }
    } else {
      if (shareQues.length>20) {
        context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(shareQues.substring(0,9), 185, 378);
      context.stroke();
      context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(shareQues.substring(10,shareQues.length-1), 185, 414);
      context.stroke();
      } else {
        context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(shareQues, 185, 378);
      context.stroke();
      }
    }
    
    // //绘制验证码背景
    // context.drawImage(path3, 48, 390, 280, 84);
    // //绘制code码
    // context.setFontSize(40);
    // context.setFillStyle('#ffe200');
    // context.setTextAlign('center');
    // context.fillText('呵呵', 185, 435);
    // context.stroke();
    //绘制左下角文字背景图
    // context.drawImage(path4, 25, 520, 184, 82);
    // context.setFontSize(18);
    // context.setFillStyle('#888');
    // context.setTextAlign('left');
    // context.fillText("有选象，不纠结", 60, 540);
    // context.stroke();
    // context.setFontSize(18);
    // context.setFillStyle('#888');
    // context.setTextAlign('left');
    // context.fillText("扫码给ta你的建议～", 60, 568);
    // context.stroke();
    context.setFontSize(14);
      context.setFillStyle('#888888');
        context.setTextAlign('center');
        context.fillText('长按识别小程序 表达你的观点哟', 190, 550);
        context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("优惠券1张哦~", 35, 580);
    // context.stroke();
    //绘制右下角扫码提示语
    context.drawImage('../../images/posterArrow.png', 180, 570, 10, 6);
    let path1 = wx.getStorageSync('headerUrl');
    let qrcodeImg = wx.getStorageSync('qrcodeImg');
    console.log(qrcodeImg,path1,'imgggg qrcode');
      context.drawImage(qrcodeImg, 154, 582, 60, 60);
      // console.log(qrcodeImg,'qrcode')
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
      context.strokeStyle = "#ffe200";
      context.clip(); //裁剪上面的圆形
      context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
      context.draw();
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          // console.log(context, 'canvas')
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
    }, 2000);
  },
  //保存至相册
  saveImageToPhotosAlbum:function(){
    wx.showToast({
      title: '保存中...',
      icon: 'loading',
      duration: 3000
    });
    setTimeout(()=>{
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
          let shareMoment = backApi.shareMoment+token;
          Api.wxRequest(shareMoment,'POST',{},(res)=>{
            console.log(res,'moment')
          })
          Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~', 'none', 2000);
          this.setData({
            maskHidden: false
          })
          setTimeout(()=> {
            // wx.removeStorageSync('headerUrl');
            // wx.removeStorageSync('qrcodeImg');
            wx.navigateBack({
              delta: 1
            })
          }, 1800)
        },
        fail:(err)=>{
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                     if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      Api.wxShowToast("获取权限成功，再次点击保存到相册")
                     } else {
                      Api.wxShowToast("获取权限失败")
                     }
              }
            }) 
          }
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
            wx.openSetting({
              success(settingdata) {
                console.log(settingdata)
                     if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      Api.wxShowToast("获取权限成功，再次点击保存到相册")
                     } else {
                      Api.wxShowToast("获取权限失败")
                     }
              }
            })
          } 
        } 
      })
    },3000)
  },
  
  shareToFriend () {
    setTimeout(()=> {
      wx.navigateBack({
        delta: 1
      })
    }, 1800)
  },
  //点击生成
  // formSubmit: function (e) {
  //   var that = this;
  //   that.setData({
  //     maskHidden: false
  //   });
    
  //   setTimeout(function () {
  //     wx.hideToast()
  //     that.shareToMoment();
  //     that.setData({
  //       maskHidden: true
  //     });
  //   }, 1000)
  // },
  textBlur (e) {
    let that = this;
    let title = that.data.titleText;
    let leftText = that.data.leftText;
    let rightText = that.data.rightText;
    let direct = e.currentTarget.dataset.direct;
    if (title==='' && direct === 'title') {
      that.setData({
        titleText: '点击输入标题',
        showTextarea: false
      })
    }
    if (leftText === '' && direct === 'left') {
      that.setData({
        leftHolder: '点击输入左选项',
        showLeft: false
      })
    }
    if (rightText === '' && direct === 'right') {
      that.setData({
        rightHolder: '点击输入右选项',
        showRight: false
      })
    }
    if (title===''||leftText===''||rightText===''){
      that.setData({
        isPublish: false
      })
    }

  },
  // 输入框
  textTap (e) {
    let that = this;
    let title = that.data.titleText;
    let leftHolder = that.data.leftHolder;
    let direct = e.currentTarget.dataset.direct;
    let rightHolder = that.data.rightHolder;
    console.log(title, 'teee')
    if (title === '点击输入标题' && direct === 'title') {
      that.setData({
        titleText: '',
        showTextarea: true
      })
    }
    if (leftHolder === '点击输入左选项' && direct === 'left') {
      that.setData({
        leftHolder: '',
        showLeft: true
      })
    }
    if (rightHolder === '点击输入右选项' && direct === 'right') {
      that.setData({
        rightHolder: '',
        showRight: true
      })
    }
    // console.log(e, 'blur')
    // let direct = e.currentTarget.dataset.direct;
    // let val = e.detail.value;
    // if (direct === 'title' && val === '') {
    //   that.setData({
    //     titleText: '点击输入标题',
    //     showTextarea: false
    //   })
    // }
    // if (direct === 'left' && val === '') {
    //   that.setData({
    //     leftHolder: '点击输入左选项',
    //     showLeft: false
    //   })
    // }
    // if (direct === 'right' && val === '') {
    //   that.setData({
    //     rightHolder: '点击输入右选项',
    //     showRight: false
    //   })
    // }
  }
});

function downLoadImg(netUrl, storageKeyAvatarUrl) {
  wx.getImageInfo({
    src: netUrl,    //请求的网络图片路径
    success: function (res) {
      //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
      wx.setStorageSync(storageKeyAvatarUrl,res.path);

    }
  })
}