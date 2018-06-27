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
    winWidth: 0,
    quesId: '',
    maskHidden: false,
    path2:"../../images/bg.png",
    touxiang:'../../images/logo.png',
    isMy: false,
    ismyVoted: false,
    choose1_orgin: 0,
    choose2_orgin: 0,
    showVoteMsk: false,
    rightRed: false,
    leftRed: false,
    hots: 0,
    showDialog: false,
    hasVoted: false,
    qrcodeImg: '',
    showPosterView: false,
    viewWidth: 0
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
            uavatar: userInfo.avatarUrl
          })
          wx.setStorageSync('userInfo', userInfo);
          Api.wxRequest(userInfoApi,'PUT',userInfo,(res)=> {
            if (res.data.status*1===200) {
              
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options, 'sss')
    let sec = options.scene || '';
    if (sec) {
      qid = sec;
    } else {
      qid = options.id;
    }
    
    let that = this;
    let myTag = options.my;
    if (myTag*1===1) {
      that.setData({isMy: true})
    }
    setTimeout(()=>{
      token = app.globalData.access_token;
      let detailUrl = backApi.quesDetail+qid;
      let myChooseTagApi = backApi.myChooseTagApi+token;
      Api.wxRequest(detailUrl,'GET',{},(res)=>{
        
        if (res.data.data.id) {
          if (res.data.data.status*1===4) {
            Api.wxShowToast('该话题已被删', 'none', 3000);
            setTimeout(()=>{
              wx.reLaunch({
                url: `/pages/main/main`
              })
            },1500)
          } else {
            that.setData({
              details: res.data.data,
              quesId: res.data.data.id,
              hots: res.data.data.hots
            })
            if (res.data.data.member) {
              that.setData({
                userInfo: res.data.data.member
              })
            }
          }
        } else {
          Api.wxShowToast('网络错误，请重试', 'none', 400);  
        }
      })
      Api.wxRequest(myChooseTagApi,'GET',{qid:qid},(res)=> {
        
        if (res.data === '') {
          that.setData({
            ismyVoted: false
          })
        }
        if (res.data.status*1===200) {
          that.setData({
            ismyVoted: true
          })
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
    }, 400);
    
    // let leftText = that.textNumTest(that.data.details.option1);
    // let rightText = that.textNumTest(that.data.details.option2);
    // that.setData({
    //   details.option1: leftText,
    //   rightChoiceText: rightText
    // })
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({winHeight: res.windowHeight,winWidth:res.windowWidth});
      }
    })
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
  },
  onReady: function () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight,viewWidth:res.windowWidth});
      }
    })
  },
  onShow: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.language) {
      
    } else {
      that.setData({
        showDialog: true
      })
    }
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target, 'button')
    }
    let that = this;
    let questId = that.data.quesId;
    let shareFriends = backApi.shareFriends+'?access-token='+token;
    return {
      title: that.data.details.question,
      path: `/pages/main/main?qid=${questId}`,
      imageUrl:'/images/share_card.png',
      success() {
        Api.wxRequest(shareFriends,'POST',{},(res)=>{
          // console.log(res, 'friends')
        })
      },
      fail() {},
      complete() {}
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
    let that = this;
    let deleMyQues = backApi.deleMyQues+`${qid}?access-token=${token}`;
    that.setData({
      showMask: false,
      maskHidden: false
    })
    Api.wxShowModal('', '删除后不可恢复，是否确认删除？', true, (res) => {
      if (res.confirm) {
        Api.wxRequest(deleMyQues,'DELETE',{},(res)=>{
          console.log(res,' DELETE')
          if (res.data.status*1 === 200) {
            Api.wxShowToast('删除成功', 'none', 2000);
            setTimeout(()=> {
              wx.navigateBack({
                delta: 1
              })
            }, 600)
          }
        })
      }
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
    cxt.fillStyle = 'rgba(231, 76, 73, 1)';
    cxt.fill();

},
closePoster () {
  this.setData({
    maskHidden: false
  })
},
shareToMoment () {
  wx.showToast({
    title: '海报生成中...',
    icon: 'loading',
    duration: 1500
  });

  var that = this;
  let avatar = that.data.details.member.avatar;
  var question = that.data.details.question;
  downLoadImg(avatar, 'headerUrl');
  let path1 = '';
  that.setData({
    showMask: false,
    maskHidden: true
  })
  let posterApi = backApi.posterApi+token;
    let postData = {
      page:`pages/details/details`,
      scene: that.data.quesId
    }
    Api.wxRequest(posterApi,'POST',postData,(res)=>{
      console.log(res,'poster')
      if (res.data.status*1===200) {
        if (res.data.data.url) {
          let qrcodeImg = res.data.data.url
          that.setData({qrcodeImg: qrcodeImg,showPosterView: true});
          downLoadImg(qrcodeImg, 'qrcodeImg');
        }
      } else {
        Api.wxShowToast('小程序码获取失败~', 'none', 2000)
      }
    })
    
    setTimeout(()=>{
      var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, 375, 667)
    var path = "../../images/posterBg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    
    context.drawImage(path, 0, 0, 375, 154);
    // context.draw();
    
    let qrcodeImg = wx.getStorageSync('qrcodeImg');
    console.log(qrcodeImg,'imgggg')
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
    // context.fillText(that.data.details.member.nickname||'', 185, 340);
    // context.stroke();
    //绘制一起吃面标语
    let chineseReg = /[\u4E00-\u9FA5]/g;
    if (chineseReg.test(question)) {
      if (question.match(chineseReg).length >= 10) {  //返回中文的个数
        context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(question.substring(0,9), 185, 378);
      context.stroke();
      context.setFontSize(27);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(question.substring(10,19)+'...', 185, 414);
      context.stroke();
      } else {
        context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(question, 185, 378);
      context.stroke();
      }
    } else {
      if (question.length>20) {
        context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(question.substring(0,9), 185, 378);
      context.stroke();
      context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(question.substring(10,question.length-1)+'...', 185, 414);
      context.stroke();
      } else {
        context.setFontSize(26);
      context.setFillStyle('#343434');
      context.setTextAlign('center');
      context.fillText(question, 185, 378);
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
    
    //绘制头像
    
      context.drawImage('../../images/posterArrow.png', 180, 570, 10, 6);
      context.drawImage(qrcodeImg, 154, 582, 60, 60);
      path1 = wx.getStorageSync('headerUrl');
      context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
      context.strokeStyle = "#ffe200";
      context.clip(); //裁剪上面的圆形
      context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
      context.draw();
    },200)
      
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
    }, 500);
},
showMaskHidden () {
  let that = this;
  that.setData({
    maskHidden: true
  })
},
  cancelPoster () {
    let that = this;
    that.setData({
      maskHidden: false
    })
  },
  
  shareToFriends () {
    // this.setData({
    //   showMask: false,
    //   maskHidden: true
    // })
  },
  //保存至相册
  saveImageToPhotosAlbum:function(){
    console.log('save', 'sannnnn')
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success:(res)=>{
        Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~', 'none', 2000)
        let shareMoment = backApi.shareMoment+token;
        Api.wxRequest(shareMoment,'POST',{},(res)=>{
          console.log(res,'moment')
        })
        
        this.setData({
          maskHidden: false,
          showPosterView: false
        })
      },
      fail:(err)=>{
        console.log(err, 'errMsg')
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log('saveeee')
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
    if (!this.data.imagePath){
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel:false
      })
    }
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    that.setData({
      maskHidden: false,
      showShare: false
    });
    
    setTimeout(function () {
      wx.hideToast()
      that.shareToMoment();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  //  投票
  goVote (e) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.language) {
      let hasVoted = that.data.hasVoted;
      let chooseItem = e.currentTarget.dataset.choose;
      let details = e.currentTarget.dataset.details;
      let choose1_orgin = that.data.choose1_orgin;
      let choose2_orgin = that.data.choose2_orgin;
      let ismyVoted = that.data.ismyVoted
      let answerApi = backApi.u_answer;
      let qid = details.id;
      let answerData = {
        qid: qid,
        choose: ''
      }
      if (hasVoted) {
        Api.wxShowToast('这个问题投过票了', 'none', 2000);
        return false
      }
      
      if (chooseItem === 'one' && !ismyVoted || chooseItem === 'two' && !ismyVoted) {
        that.setData({
          showVoteMsk: true
        })

        if (chooseItem === 'one') {
          answerData.choose = 1
          that.setData({
            leftRed: true
          })
        }
        if (chooseItem === 'two') {
          answerData.choose = 2
          that.setData({
            rightRed: true
          })
        }

        let watchQuesApi = backApi.watchQuesApi+token;
        Api.wxRequest(answerApi+token,'POST',answerData,(res)=>{
          let status = res.data.status*1;
          console.log(res.data, 'choose')
          // 
          if (status === 201) {
            that.setData({
              hasVoted: true
            })
            Api.wxRequest(watchQuesApi,'POST',{qid: res.data.data.id}, (res)=> {
              console.log(res, 'ssss')
            })
            // 请求通知消息
            let msgTotalApi = backApi.msgUnreadTotal+token
            Api.wxRequest(msgTotalApi,'GET',{},(res)=>{
              // console.log(res, 'sssssssss')
              if (res.data.status*1===200) {
                setTimeout(()=> {
                  let msgTotal = res.data.data.total;
                  wx.setStorageSync('msgTotal', msgTotal);
                  that.setData({msgCount: msgTotal})
                }, 100)
              } else {
                Api.wxShowToast('网络出错了', 'none', 2000);
              }
            })
            // 请求投票消息
            let voteUnreadApi = backApi.voteUnreadApi+token
            Api.wxRequest(voteUnreadApi,'GET',{},(res)=>{
              // console.log(res, 'sssssssss')
              if (res.data.status*1===200) {
                if (res.data.data.vote) {
                  wx.setStorageSync('msgTotal', res.data.data.vote);
                  that.setData({msgCount: res.data.data.vote})
                }
              } else {
                Api.wxShowToast('网络出错了', 'none', 2000);
              }
            })
            let detailUrl = backApi.quesDetail+qid;
            // let myChooseTagApi = backApi.myChooseTagApi+token;
            Api.wxRequest(detailUrl,'GET',{},(res)=>{
              if (res.data.data.id) {
                let choose2 = res.data.data.choose2_per;
                let choose1 = res.data.data.choose1_per;
                details.hots = res.data.data.hots;
                let timer2 = setInterval(()=>{
                  if (choose2 >= 20) {
                    choose2_orgin=choose2_orgin+2;
                  } else {
                    choose2_orgin=choose2_orgin+3;
                  }
                  details.choose2_per = choose2_orgin;
                  that.setData({
                    details: details
                  })
                  if(choose2_orgin >= choose2){
                    clearInterval(timer2);
                    details.choose2_per = choose2;
                    that.setData({
                      details: details
                    })
                  }
                }, 30);
                let timer1 = setInterval(()=>{
                  if (choose1 >= 20) {
                    choose1_orgin=choose1_orgin+2;
                  } else {
                    choose1_orgin=choose1_orgin+3;
                  }
                  details.choose1_per = choose1_orgin;
                  that.setData({
                    details: details
                  })
                  if(choose1_orgin >= choose1){
                    clearInterval(timer1);
                    details.choose1_per = choose1;
                    that.setData({
                      details: details
                    })
                  }
                }, 30);
              } else {
                Api.wxShowToast('网络错误，请重试', 'none', 2000);  
              }
            })
            
          }
        });
        
      }
    } else {
      that.setData({
        showDialog: true
      })
    }
    
  },
  gotoOthers (e) {
    // console.log(e, 'iddd')
    let mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: `/pages/others/others?mid=${mid}`
    })
  }
})

function downLoadImg(netUrl, storageKeyAvatarUrl) {
  wx.getImageInfo({
    src: netUrl,    //请求的网络图片路径
    success: function (res) {
      //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
      wx.setStorage({
        key: storageKeyAvatarUrl,
        data: res.path,
      });

    }
  })
}