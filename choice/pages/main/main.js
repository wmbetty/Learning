const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';
var startx, starty;

Page({
  data: {
    startPoint: [],
    animationData: {},
    questionList: [],
    currentIndex: 0,
    numActive: false,
    choose1_orgin: 0,
    choose2_orgin: 0,
    showMask: false,
    showShare: false,
    touxiang:"../../images/bg.png",
    path2:"../../images/my_bg.jpg",
    middBg: '../../images/mddleBg.png',
    posterQrcode: '../../images/posterQrcode.png',
    choose_left: false,
    imagePath: '',
    showDialog: false,
    qid: '',
    quesId: 0,
    question: '',
    msgCount: 0,
    avatar: '',
    isEmpty: false,
    voteUnreadCount: 0,
    page: 1,
    nname: '',
    viewHeight: 0,
    viewWidth: 0,
    maskHidden: false,
    showPosterView: false,
    qrcodeImg: '',
    cardTop: 0
  },
  //手指接触屏幕
  touchstart (e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
  },
  //手指离开屏幕
  touchend (e) {
    let that = this;
    let curr_id = e.currentTarget.dataset.item.id;
    let index = e.currentTarget.dataset.index;
    let qList = that.data.questionList;
    let watchQuesApi = backApi.watchQuesApi+token;
    let noTopQuesApi = backApi.noTopQues+token;
    let page = that.data.page;
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    if (direction === 1) {
      that.slidethis(index,curr_id);
                if (qList.length-1===0) {
                  Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
                    if (res.data.status*1 === 200) {
                      that.setData({page: page+1});
                      let topDatas = res.data.data || [];
                      if (topDatas.length===0) {
                        Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
                          let datas = res.data.data || [];
                          if (datas.length===0) {
                            // that.setData({
                            //   isEmpty: true
                            // })
                          } else {
                            if (datas.length > 0) {
                              for (let item of datas) {
                                item.option1 = item.option1.substring(0, 18);
                                item.option2 = item.option2.substring(0, 18);
                                item.question = item.question.substring(0, 30);
                              }
                              // qList = qList.concat(topDatas);
                              that.setData({qList: topDatas});
                              Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                                console.log('watch')
                              })
                            } else {
                              // that.setData({
                              //   isEmpty: true
                              // })
                            }
                          }
                        })
                      } else {
                        for (let item of topDatas) {
                          item.option1 = item.option1.substring(0, 18);
                          item.option2 = item.option2.substring(0, 18);
                          item.question = item.question.substring(0, 30);
                        }
                        // qList = qList.concat(topDatas);
                        that.setData({questionList: topDatas});
                        Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                          console.log('watch')
                        })
                      }
                    }
                  })
                } else {
                  Api.wxRequest(watchQuesApi,'POST',{qid: curr_id}, (res)=> {
                    console.log(res, 'watch')
                    if (res.data.status*1===201) {
                      if (qList.length-1===0) {
                        let noTopQuesApi = backApi.noTopQues+token;
                        let page = that.data.page;
                        setTimeout(()=>{
                          Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
                            // console.log(res, 'rssssleng10后')
                            if (res.data.status*1 === 200) {
                              // console.log(res, 'rssssleng10后')
                              that.setData({page: page+1});
                              let topDatas = res.data.data || [];
                              wx.hideLoading();
                              if (topDatas.length===0) {
                                Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
                                  let datas = res.data.data || [];
                                  if (datas.length===0) {
                                    // that.setData({
                                    //   isEmpty: true
                                    // })
                                  } else {
                                    if (datas.length > 0) {
                                      for (let item of datas) {
                                        item.option1 = item.option1.substring(0, 18);
                                        item.option2 = item.option2.substring(0, 18);
                                        item.question = item.question.substring(0, 30);
                                      }
                                      // chooseDatas = chooseDatas.concat(datas);
                                      that.setData({questionList: datas});
                                      Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                                        console.log('watch')
                                      })
                                    } else {
                                      Api.wxShowToast('没有数据了，去发布吧', 'none', 2000);
                                    }
                                  }
                                })
                              } else {
                                for (let item of topDatas) {
                                  item.option1 = item.option1.substring(0, 18);
                                  item.option2 = item.option2.substring(0, 18);
                                  item.question = item.question.substring(0, 30);
                                }
                                // chooseDatas = chooseDatas.concat(topDatas);
                                // console.log(chooseDatas, 'chsss')
                                that.setData({questionList: topDatas});
                              }
                            }
                          })
                        },300)
                        
                      }
                    }
                    let resMsg = res.data.msg || '';
                    if (resMsg.indexOf('Qid and Mid has already been taken') != -1 && resMsg) {
                      // that.go
                    }
                    if (res.data.status*1===201) {
                      console.log('watched')
                    }
                  })
                }
    }
  },
  //事件处理函数
  slidethis (index, qid) {
    let that = this;
    let page = that.data.page;
    let noTopQuesApi = backApi.noTopQues+token;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    that.animation = animation;
    that.animation.translateY(-(that.data.viewHeight-60)).translateX(15).step();
    that.animation.opacity(0).step({duration: 1200});
    // that.animation.translateY(50).translateX(0).opacity(0).step();
    // that.animation.translateY(-200).translateX(15).opacity(0).step();
    var animationData = that.data.animationData;
    animationData[index] = that.animation.export();
    that.setData({
      animationData: animationData,
      cardTop: 380
    });
    setTimeout(function() {
      var questionList = that.data.questionList;
      console.log(index,questionList.length,'lllla')
      if (index===questionList.length-1) {
        Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
          if (res.data.status*1 === 200) {
            that.setData({page: page+1});
            let topDatas = res.data.data || [];
            if (topDatas.length===0) {
              Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
                let datas = res.data.data || [];
                if (datas.length===0) {
                  that.setData({
                    isEmpty: true
                  })
                } else {
                  if (datas.length > 0) {
                    for (let item of datas) {
                      item.option1 = item.option1.substring(0, 18);
                      item.option2 = item.option2.substring(0, 18);
                      item.question = item.question.substring(0, 30);
                    }
                    questionList = questionList.concat(topDatas);
                    that.setData({questionList: questionList});
                    Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                      console.log('watch')
                    })
                  } else {
                    that.setData({
                      isEmpty: true
                    })
                  }
                }
              })
            } else {
              for (let item of topDatas) {
                item.option1 = item.option1.substring(0, 18);
                item.option2 = item.option2.substring(0, 18);
                item.question = item.question.substring(0, 30);
              }
              questionList = questionList.concat(topDatas);
              that.setData({questionList: questionList});
            }
          }
        })
      }
      // }
      // var slidethis = questionList.shift();
      // console.log(self.data.questionList, 'listttt')
      // self.data.questionList.unshift(slidethis);
      // console.log(self.data.questionList, 'poppppp')
      // console.log(self.data.questionList,'lll')
      // var index = e.target.dataset.index;
      // var animationData = this.data.animationData;
      // animationData[index] = this.animation.export();
    }, 300);
  },
  
  onLoad: function () {
    console.log('onLoad');
    let that = this;
    tabBar.tabbar("tabBar", 0, that);
    let questId = wx.getStorageSync('quesid');
    if (questId) {
      wx.navigateTo({
        url: `/pages/details/details?id=${questId}`
      })
      setTimeout(()=> {
        wx.setStorageSync('quesid', '');
      }, 300)
    }
  },
  onShow () {
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    // app.js onLunch为异步事件
    setTimeout(()=>{
      token = wx.getStorageSync('token');
      let watchQuesApi = backApi.watchQuesApi+token;
      let noTopQuesApi = backApi.noTopQues+token;
      let page = that.data.page;
      
      // console.log(token)
      Api.wxRequest(backApi.questions+token, 'GET', {page: page}, (res)=>{
        // console.log(res, 'ressslater')
        let status = res.data.status*1;
        if (status===200) {
          wx.hideLoading();
          let datas = res.data.data || [];
          if (datas.length===0) {
            // top=0时
            Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
              let status = res.data.status*1;
              if (status===200) {
                let datas = res.data.data || [];
                if (datas.length>0) {
                  for (let item of datas) {
                    item.option1 = item.option1.substring(0, 18);
                    item.option2 = item.option2.substring(0, 18);
                    item.question = item.question.substring(0, 30);
                  }
                  that.setData({questionList: datas})
                } else {
                  that.setData({
                    isEmpty: true
                  })
                }
              } else {
                Api.wxShowToast('网络出错了', 'none', 2000);
              }
            })
          }
          if (datas.length>0) {
            for (let item of datas) {
              item.option1 = item.option1.substring(0, 18);
              item.option2 = item.option2.substring(0, 18);
              item.question = item.question.substring(0, 30);
            }
            that.setData({questionList: datas})
            Api.wxRequest(watchQuesApi,'POST',{qid: datas[0].id}, (res)=> {
              if (res.data.status*1===201) {
                console.log('watched')
              }
            })
          } else {
            that.setData({
              isEmpty: true
            })
          }
        } else {
          Api.wxShowToast('网络出错了', 'none', 2000);
        }
      })
    },80)
    let msgCount = wx.getStorageSync('msgTotal');
    let voteUnreadCount = wx.getStorageSync('voteUnreadCount');
      that.setData({
        msgCount: msgCount,
        voteUnreadCount: voteUnreadCount
      })
  },
  onReady () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight,viewWidth:res.windowWidth});
      }
    })
  },
  onShareAppMessage () {
    let that = this;
    let questId = that.data.quesId;
    let shareFriends = backApi.shareFriends+'?access-token='+token;
    return {
      title: that.data.question,
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
    cxt.fillStyle = 'rgba(231, 76, 73, 1)';
    cxt.fill();

},
  shareToMoment () {
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1500
    });
    var that = this;
    that.setData({
      showShare: false,
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
            let qrcodeImg = res.data.data.url;
            that.setData({qrcodeImg: qrcodeImg,showPosterView: true});
            downLoadImg(qrcodeImg, 'qrcodeImg');
            
          }
        } else {
          Api.wxShowToast('小程序码获取失败~', 'none', 2000)
        }
      })
  
      var context = wx.createCanvasContext('mycanvas');
      var question = that.data.question;
      
      context.setFillStyle("#ffffff")
      context.fillRect(0, 0, 375, 667)
      var path = "../../images/posterBg.png";
      //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
      //不知道是什么原因，手机环境能正常显示
      // downLoadImg(that.data.details.member.avatar, 'headerUrl');
      context.drawImage(path, 0, 0, 375, 154);
      let path1 = wx.getStorageSync('headerUrl');
      let qrcodeImg = wx.getStorageSync('qrcodeImg');
      // console.log(qrcodeImg,'imgggg')
      // console.log(path1,"path1")
      //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
      // var path2 = "/images/tx_bg.jpg";
      // var path3 = "/images/posterBg.png";
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
      // context.fillText(that.data.nname||'', 185, 340);
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
      context.setFontSize(14);
      context.setFillStyle('#888888');
        context.setTextAlign('center');
        context.fillText('长按识别小程序 表达你的观点哟', 190, 550);
        context.stroke();
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
      // context.setFontSize(12);
      // context.setFillStyle('#333');
      // context.setTextAlign('left');
      // context.fillText("优惠券1张哦~", 35, 580);
      // context.stroke();
      //绘制右下角扫码提示语

      context.drawImage('../../images/posterArrow.png', 180, 570, 10, 6);
      context.drawImage(qrcodeImg, 154, 582, 60, 60);
      
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
      }, 500);
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
          maskHidden: false
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
  shareToFriends () {
    this.setData({
      showShare: false
    })
  },
  cancelShare () {
    this.setData({
      showShare: false
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
    let userInfoApi = backApi.userInfo+token
    that.setData({
      showDialog: false
    });
    wx.getUserInfo({
      success: (res)=>{
        let userInfo = res.userInfo;
        if (userInfo.nickName) {
          wx.setStorageSync('userInfo', userInfo);
          Api.wxRequest(userInfoApi,'PUT',userInfo,(res)=> {
            console.log(res.data.status, 'sssssssss')
          })
        }
      },
      complete: (res)=>{
        console.log(res, 'infocom')
        let errMsg = res.errMsg || '';
        if (errMsg === 'getUserInfo:fail auth deny') {
          wx.openSetting({
            success(settingdata) {
              if (settingdata.authSetting["scope.userInfo"]) {
                Api.wxShowToast("获取权限成功")
               } else {
                Api.wxShowToast("获取权限失败")
               }
            }
          })
        }
      }
    })
  },
  // 投票
  gotoVote (e) {
    let that = this;
    // let page = that.data.page;
    let watchQuesApi = backApi.watchQuesApi+token;
    // let noTopQuesApi = backApi.noTopQues+token;
    let userInfo = wx.getStorageSync('userInfo');
    let language = userInfo.language || '';
    let answerData = {
      qid: 0,
      choose: ''
    }
    
    // 判断是否授权
    if (language) {
      
      let qList = that.data.questionList;
      let choose1_orgin = that.data.choose1_orgin;
      let choose2_orgin = that.data.choose2_orgin;
      let direct = e.currentTarget.dataset.direct;
      let idx = e.currentTarget.dataset.index;
      let choose1 = e.currentTarget.dataset.item.choose1_per;
      let choose2 = e.currentTarget.dataset.item.choose2_per;
      let qid = e.currentTarget.dataset.item.id;
      let answerApi = backApi.u_answer;
      let page = that.data.page;
      answerData.qid = qid;
      console.log(e,'xxx')

      if (idx===qList.length-1) {
        Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
          if (res.data.status*1 === 200) {
            that.setData({page: page+1});
            let topDatas = res.data.data || [];
            if (topDatas.length===0) {
              Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
                let datas = res.data.data || [];
                if (datas.length===0) {
                  that.setData({
                    isEmpty: true
                  })
                } else {
                  if (datas.length > 0) {
                    for (let item of datas) {
                      item.option1 = item.option1.substring(0, 18);
                      item.option2 = item.option2.substring(0, 18);
                      item.question = item.question.substring(0, 30);
                    }
                    qList = qList.concat(topDatas);
                    Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                      console.log('watch')
                    })
                    that.setData({questionList: qList});
                  } else {
                    that.setData({
                      isEmpty: true
                    })
                  }
                }
              })
            } else {
              for (let item of topDatas) {
                item.option1 = item.option1.substring(0, 18);
                item.option2 = item.option2.substring(0, 18);
                item.question = item.question.substring(0, 30);
              }
              qList = qList.concat(topDatas);
              Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                console.log('watch')
              })
              that.setData({questionList: qList});
            }
          }
        })
      }
      // qList[0].showMask = true;
      if (direct === 'left') {
        answerData.choose = 1;
        Api.wxRequest(answerApi+token,'POST',answerData,(res)=>{
          let status = res.data.status*1;
          // 投票成功后
          if (status === 201) {
            let afterChoose = res.data.data;
            let chse1 = afterChoose.choose1_per;
            let chse2 = afterChoose.choose2_per;
            for (let i=0;i<qList.length;i++) {
              if (idx===i) {
                qList[i].choose_left = true;
                qList[i].showMask = true;
                qList[i].hots = afterChoose.hots;
                if (chse1 === 0) {
                  let timer1 = setInterval(()=>{
                    if (chse2 >= 20) {
                      choose2_orgin=choose2_orgin+2;
                    } 
                    if (chse2>30) {
                      choose2_orgin=choose2_orgin+3;
                    }
                    qList[i].choose1_per = chse1;
                    qList[i].choose2_per = choose2_orgin;
                    that.setData({
                      questionList: qList
                    })
                    if(choose2_orgin >= chse2){
                      clearInterval(timer1);
                      qList[i].choose2_per = chse2;
                      that.setData({
                        questionList: qList
                      })
                    }
                  }, 10);
                }
                if (chse2 === 0) {
                  
                  let timer1 = setInterval(()=>{
                    if (chse1 >= 20) {
                      choose1_orgin=choose1_orgin+2;
                    } 
                    if (chse1>30) {
                      choose1_orgin=choose1_orgin+3;
                    }
                    qList[i].choose1_per = choose1_orgin;
                    qList[i].choose2_per = chse2;
                    that.setData({
                      questionList: qList
                    })
                    if(choose1_orgin >= chse1){
                      clearInterval(timer1);
                      qList[i].choose1_per = chse1;
                      that.setData({
                        questionList: qList
                      })
                    }
                    
                  }, 10);
                }
                if (chse1 !== 0 && chse2 !== 0) {
                  let timer1 = setInterval(()=>{
                    choose1_orgin=choose1_orgin+2;
                    choose2_orgin=choose2_orgin+2;
                    qList[i].choose1_per = choose1_orgin;
                    qList[i].choose2_per = choose2_orgin;
                    that.setData({
                      questionList: qList
                    })
                    if(choose1_orgin >= chse1 || choose2_orgin>=chse2){
                      clearInterval(timer1);
                      qList[i].choose1_per = chse1;
                      qList[i].choose2_per = chse2;
                      that.setData({
                        questionList: qList
                      })
                    }
                  }, 10);
                }
              }
            }  
          } else {
            Api.wxShowToast('投过票了', 'none', 2000);
          }
          // Api.wxRequest(watchQuesApi,'POST',{qid: qid}, (res)=> {
          //   console.log(res, 'ssss')
          // })
        })
        
      }
      if (direct === 'right') {
        answerData.choose = 2;
        Api.wxRequest(answerApi+token,'POST',answerData,(res)=>{
          let status = res.data.status*1;
          // 投票成功后
          if (status === 201) {
            let afterChoose = res.data.data;
            let chse1 = afterChoose.choose1_per;
            let chse2 = afterChoose.choose2_per;
            for (let i=0;i<qList.length;i++) {
              if (idx===i) {
                qList[i].choose_right = true;
                qList[i].showMask = true;
                qList[i].hots = afterChoose.hots;
                if (chse1 === 0) {
                  let timer1 = setInterval(()=>{
                    if (chse2 >= 20) {
                      choose2_orgin=choose2_orgin+2;
                    } 
                    if (chse2>30) {
                      choose2_orgin=choose2_orgin+3;
                    }
                    qList[i].choose1_per = chse1;
                    qList[i].choose2_per = choose2_orgin;
                    that.setData({
                      questionList: qList
                    })
                    if(choose2_orgin >= chse2){
                      clearInterval(timer1);
                      qList[i].choose2_per = chse2;
                      that.setData({
                        questionList: qList
                      })
                    }
                  }, 10);
                }
                if (chse2 === 0) {
                  
                  let timer1 = setInterval(()=>{
                    if (chse1 >= 20) {
                      choose1_orgin=choose1_orgin+2;
                    } 
                    if (chse1>30) {
                      choose1_orgin=choose1_orgin+3;
                    }
                    qList[i].choose1_per = choose1_orgin;
                    qList[i].choose2_per = chse2;
                    that.setData({
                      questionList: qList
                    })
                    if(choose1_orgin >= chse1){
                      clearInterval(timer1);
                      qList[i].choose1_per = chse1;
                      that.setData({
                        questionList: qList
                      })
                    }
                    
                  }, 10);
                }
                if (chse1 !== 0 && chse2 !== 0) {
                  let timer1 = setInterval(()=>{
                    choose1_orgin=choose1_orgin+2;
                    choose2_orgin=choose2_orgin+2;
                    qList[i].choose1_per = choose1_orgin;
                    qList[i].choose2_per = choose2_orgin;
                    that.setData({
                      questionList: qList
                    })
                    if(choose1_orgin >= chse1 || choose2_orgin>=chse2){
                      clearInterval(timer1);
                      qList[i].choose1_per = chse1;
                      qList[i].choose2_per = chse2;
                      that.setData({
                        questionList: qList
                      })
                    }
                  }, 10);
                }
              }
            }
          } else {
            Api.wxShowToast('投过票了', 'none', 2000);
          }
          Api.wxRequest(watchQuesApi,'POST',{qid: qid}, (res)=> {
            console.log(res, 'ssss')
          })
        })
      }
      
      setTimeout(()=>{
        that.slidethis(idx,qid);
        // if (that.data.questionList.length===1) {
        //   that.setData({
        //             isEmpty: true
        //           })
        // }
      },6000)

    } else {
      // 微信授权
      that.setData({
        showDialog: true
      })
    }
  },
  showMaskHidden () {
    this.setData({
      maskHidden: true
    })
  },
  closePoster () {
    this.setData({
      maskHidden: false
    })
  },
  // 到他人中心
  gotoOthers (e) {
    let mid = e.target.dataset.mid;
    wx.navigateTo({
      url: `/pages/others/others?mid=${mid}`
    })
  },
  goShare (e) {
    
    let that = this;
    let quesId = e.target.dataset.question.id;
    let question = e.target.dataset.question.question;
    console.log(question,'nnnn')
    let avatar = e.target.dataset.question.member.avatar;
    let nname = e.target.dataset.question.member.nickname;
    downLoadImg(avatar, 'headerUrl');
    that.setData({
      showShare: true,
      quesId: quesId,
      question: question,
      nname: nname,
      avatar: avatar
    })
    // let posterApi = backApi.posterApi+token;
    // let posterScene = wx.getStorageSync('posterScene');
    // let postData = {
    //   page:'pages/main/main',
    //   scene: posterScene
    // }
    // Api.wxRequest(posterApi,'POST',postData,(res)=>{
    //   if (res.data.status*1===200) {
    //     if (res.data.data.url) {
    //       qrcodeImg = res.data.data.url
    //       downLoadImg(qrcodeImg, 'qrcodeImg');
    //     }
    //   }
    // })
  }
})

//获得角度
function getAngle(angx, angy) {
  return Math.atan2(angy, angx) * 180 / Math.PI;
};
//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;
  console.log(angy, 'angy')
  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
      return result;
  }

  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
      result = 1;
  } else if (angle > 45 && angle < 135) {
      result = 2;
  }

  return result;
}

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
