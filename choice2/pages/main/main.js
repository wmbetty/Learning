const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';
let baseLock = '';
let downList = [];
var startx, starty;

Page({
  data: {
    startPoint: [],
    animationData: {},
    animationDownData: {},
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
    notopPage: 1,
    nname: '',
    viewHeight: 0,
    viewWidth: 0,
    maskHidden: false,
    showPosterView: false,
    qrcodeImg: '',
    cardTop: 0,
    showScore: false,
    isDown: false,
    frontIndex: 0,
    frontId: 0,
    hadUp: false,
    showUserbase: false,
    openType: 'getUserInfo',
    authInfo: '需要微信授权登录才能更多操作哦'
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
    let listItem = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let qList = that.data.questionList;
    
    let noTopQuesApi = backApi.noTopQues+token;
    let page = that.data.page;
    // let downList = that.data.downList;
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    if (direction === 1) {
      that.setData({isDown: false});
      that.slidethis(index,curr_id,listItem);
      // downList = downList.concat(listItem);
      that.setData({hadUp: true,showUserbase: false});

                // if (index === qList.length-1) {
                //   Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
                //     if (res.data.status*1 === 200) {
                //       that.setData({page: page+1});
                //       let topDatas = res.data.data || [];
                //       if (topDatas.length===0) {
                //         Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
                //           let datas = res.data.data || [];
                //           if (datas.length===0) {
                //             that.setData({
                //               isEmpty: true
                //             })
                //           } else {
                //             that.setData({isEmpty: false})
                //             if (datas.length > 0) {
                //               for (let item of datas) {
                //                 item.option1 = item.option1.substring(0, 18);
                //                 item.option2 = item.option2.substring(0, 18);
                //                 item.question = item.question.substring(0, 30);
                //               }
                //               qList = qList.concat(topDatas);
                //               that.setData({questionList: qList});
                //               Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                //                 console.log('watch')
                //               })
                //             } else {
                //               that.setData({
                //                 isEmpty: true
                //               })
                //             }
                //           }
                //         })
                //       } else {
                //         for (let item of topDatas) {
                //           item.option1 = item.option1.substring(0, 18);
                //           item.option2 = item.option2.substring(0, 18);
                //           item.question = item.question.substring(0, 30);
                //         }
                //         qList = qList.concat(topDatas);
                //         that.setData({questionList: qList});
                //         Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                //           console.log('watch')
                //         })
                //       }
                //     }
                //   })
                // } else {
                //   Api.wxRequest(watchQuesApi,'POST',{qid: curr_id}, (res)=> {
                //     console.log(res, 'watch')
                //     if (res.data.status*1===201) {
                //       if (index === qList.length-1) {
                //         let noTopQuesApi = backApi.noTopQues+token;
                //         let page = that.data.page;
                //         setTimeout(()=>{
                //           Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
                //             // console.log(res, 'rssssleng10后')
                //             if (res.data.status*1 === 200) {
                //               // console.log(res, 'rssssleng10后')
                //               that.setData({page: page+1});
                //               let topDatas = res.data.data || [];
                //               wx.hideLoading();
                //               if (topDatas.length===0) {
                //                 Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
                //                   let datas = res.data.data || [];
                //                   if (datas.length===0) {
                //                     that.setData({
                //                       isEmpty: true
                //                     })
                //                   } else {
                //                     if (datas.length > 0) {
                //                       for (let item of datas) {
                //                         item.option1 = item.option1.substring(0, 18);
                //                         item.option2 = item.option2.substring(0, 18);
                //                         item.question = item.question.substring(0, 30);
                //                       }
                //                       qList = qList.concat(datas);
                //                       that.setData({questionList: qList});
                //                       Api.wxRequest(watchQuesApi,'POST',{qid: topDatas[0].id}, (res)=> {
                //                         console.log('watch')
                //                       })
                //                     } else {
                //                       Api.wxShowToast('没有数据了，去发布吧', 'none', 2000);
                //                     }
                //                   }
                //                 })
                //               } else {
                //                 for (let item of topDatas) {
                //                   item.option1 = item.option1.substring(0, 18);
                //                   item.option2 = item.option2.substring(0, 18);
                //                   item.question = item.question.substring(0, 30);
                //                 }
                //                 qList = qList.concat(topDatas);
                //                 // console.log(chooseDatas, 'chsss')
                //                 that.setData({questionList: qList});
                //               }
                //             }
                //           })
                //         },300)
                        
                //       }
                //     }
                //     let resMsg = res.data.msg || '';
                //     if (resMsg.indexOf('Qid and Mid has already been taken') != -1 && resMsg) {
                //       // that.go
                //     }
                //     if (res.data.status*1===201) {
                //       console.log('watched')
                //     }
                //   })
                // }
    } else {
      // 下滑事件
      that.setData({isDown: true});
      let hadUp = that.data.hadUp;
      console.log(downList, 'tttt');
      that.slideDown(index, curr_id)
      // if (hadUp) {
      //   // that.slidethis(index,curr_id);
      // }
      console.log('downnnn')
    }
  },
  slideDown (index, qid) {
    let that = this;
    // let isDown = that.data.isDown;
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    that.animation = animation;
    that.animation.translateY((that.data.viewHeight-60)).translateX(15).step();
      that.animation.opacity(0).step({duration: 1200});
      var animationData = that.data.animationDownData;
    animationData[index] = that.animation.export();
    that.setData({
      animationDownData: animationData
    });
  },
  //事件处理函数
  slidethis (index, qid, card) {
    
    let that = this;
    let page = that.data.page;
    let notopPage = that.data.notopPage;
    // let isDown = that.data.isDown;
    let watchQuesApi = backApi.watchQuesApi+token;
    let noTopQuesApi = backApi.noTopQues+token;
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    that.animation = animation;
    // if (isDown) {
    //   that.animation.translateY((that.data.viewHeight-60)).translateX(15).step();
    //   that.animation.opacity(1).step({duration: 1200});
    // } else {
    //   that.animation.translateY(-(that.data.viewHeight-60)).translateX(15).step();
    //   that.animation.opacity(0).step({duration: 1200});
    // }
    
      that.animation.translateY(-(that.data.viewHeight-60)).translateX(15).step();
      that.animation.opacity(0).step({duration: 1200});

    // that.animation.translateY(50).translateX(0).opacity(0).step();
    // that.animation.translateY(-200).translateX(15).opacity(0).step();
    var animationData = that.data.animationData;
    animationData[index] = that.animation.export();
    that.setData({
      animationData: animationData
    });
    setTimeout(function() {
      var questionList = that.data.questionList;
      // console.log(index,questionList.length,'lllla')
      // if (questionList.length>0) {
      //   that.setData({isEmpty: false})
      // }
      if (index===questionList.length-1) {
        Api.wxRequest(backApi.questions+token, 'GET', {page:page+1}, (res)=>{
          if (res.data.status*1 === 200) {
            that.setData({page: page+1})
            let topDatas = res.data.data || [];
            if (topDatas.length===0) {
              Api.wxRequest(noTopQuesApi, 'GET', {page: notopPage}, (res)=>{
                let datas = res.data.data || [];
                if (datas.length===0) {
                  that.setData({
                    isEmpty: true
                    // page: page+1
                  })
                } else {
                  that.setData({notopPage: notopPage+1});
                  if (datas.length > 0) {
                    for (let item of datas) {
                      if (item.type*1===1) {
                        item.option1 = item.option1.substring(0, 18);
                        item.option2 = item.option2.substring(0, 18);
                        item.question = item.question.substring(0, 30);
                      }
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
      } else {
        Api.wxRequest(watchQuesApi,'POST',{qid: qid}, (res)=> {
          console.log('watch')
        })
      }

      let user_random = parseInt(Math.random()*(20-10+1)+10,10);
      let showBaseApi = backApi.showBaseApi+token;
      console.log(index,user_random,baseLock,'ommm');
      if (user_random-index>1 && user_random-index<=3 && baseLock*1===2) {
        that.setData({showUserbase: true});
        Api.wxRequest(showBaseApi,'GET',{},(res)=>{console.log(res,'base')})
      }
      if (downList.length<3) {
        downList.unshift(card);
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
    }, 200);
  },
  
  onLoad: function () {
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
    wx.showLoading({
      title: '加载中',
    });

    wx.login({
      success: function(res) {
        let reqData = {};
        let code = res.code;
        if (code) {
          reqData.code = code;
          Api.wxRequest(backApi.loginApi,'POST',reqData,(res)=>{
            // console.log(res, 'apptokenuser')
            let acc_token = res.data.data.access_token;
            token = acc_token;
            // console.log(acc_token, 'token')
            if (acc_token) {
              app.globalData.access_token = acc_token;
              wx.setStorageSync('token', acc_token);
              let userInfo = wx.getStorageSync('userInfo', userInfo);
              // console.log(token, 'oooo')
              let userInfoApi = backApi.userInfo+acc_token;
              if (userInfo) {
                let userData = {
                  avatarUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  country: userInfo.country,
                  city: userInfo.city,
                  language: userInfo.language,
                  province: userInfo.province,
                  gender: userInfo.gender
                }
                
                Api.wxRequest(userInfoApi,'PUT',userData,(res)=>{
                  baseLock = res.data.data.user_base_lock;
                })
              }

              let watchQuesApi = backApi.watchQuesApi+acc_token;
              let noTopQuesApi = backApi.noTopQues+acc_token;
              let page = that.data.page;
              let notopPage = that.data.notopPage;
              Api.wxRequest(backApi.questions+acc_token, 'GET', {page: page}, (res)=>{
                let status = res.data.status*1;
                if (status===200) {
                  wx.hideLoading();
                  let datas = res.data.data || [];
                  if (datas.length===0) {
                    // top=0时
                    Api.wxRequest(noTopQuesApi, 'GET', {page: notopPage}, (res)=>{
                      let status = res.data.status*1;
                      if (status===200) {
                        let datas = res.data.data || [];
                        if (datas.length>0) {
                          for (let item of datas) {
                            if (item.type*1===1) {
                              item.option1 = item.option1.substring(0, 18);
                            item.option2 = item.option2.substring(0, 18);
                            item.question = item.question.substring(0, 30);
                            }
                          }
                          that.setData({questionList: datas})
                        }
                        if (datas.length===0) {
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
                      if (item.type*1===1) {
                        item.option1 = item.option1.substring(0, 18);
                        item.option2 = item.option2.substring(0, 18);
                        item.question = item.question.substring(0, 30);
                      }
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
            }
          })
        }
      }
    });
  },
  onShow () {
    let that = this;
    let list = that.data.questionList;
    
      // token = wx.getStorageSync('token');
      // if (list.length===0) {
      //   let watchQuesApi = backApi.watchQuesApi+token;
      // let noTopQuesApi = backApi.noTopQues+token;
      //   let page = that.data.page;
      // Api.wxRequest(backApi.questions+token, 'GET', {page: page}, (res)=>{
      //   let status = res.data.status*1;
      //   if (status===200) {
      //     wx.hideLoading();
      //     let datas = res.data.data || [];
      //     if (datas.length===0) {
      //       // top=0时
      //       Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
      //         let status = res.data.status*1;
      //         if (status===200) {
      //           let datas = res.data.data || [];
      //           if (datas.length>0) {
      //             for (let item of datas) {
      //               item.option1 = item.option1.substring(0, 18);
      //               item.option2 = item.option2.substring(0, 18);
      //               item.question = item.question.substring(0, 30);
      //             }
      //             that.setData({questionList: datas})
      //           }
      //           if (datas.length===0) {
      //             that.setData({
      //               isEmpty: true
      //             })
      //           }
      //         } else {
      //           // Api.wxShowToast('网络出错了', 'none', 2000);
      //         }
      //       })
      //     }
      //     if (datas.length>0) {
      //       for (let item of datas) {
      //         item.option1 = item.option1.substring(0, 18);
      //         item.option2 = item.option2.substring(0, 18);
      //         item.question = item.question.substring(0, 30);
      //       }
      //       that.setData({questionList: datas})
      //       Api.wxRequest(watchQuesApi,'POST',{qid: datas[0].id}, (res)=> {
      //         if (res.data.status*1===201) {
      //           console.log('watched')
      //         }
      //       })
      //     } else {
      //       that.setData({
      //         isEmpty: true
      //       })
      //     }
      //   } else {
      //     // Api.wxShowToast('网络出错了', 'none', 2000);
      //   }
      // })
      // }

  },
  onReady () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        console.log(res.windowHeight,'high')
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
      imageUrl:'/images/posterBg.jpg',
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
      duration: 2000
    });
    var that = this;
    
    let posterApi = backApi.posterApi+token;
      let postData = {
        page:`pages/details/details`,
        scene: that.data.quesId
      }
      Api.wxRequest(posterApi,'POST',postData,(res)=>{
        console.log(res,'poster')
        if (res.data.status*1===200) {
          setTimeout(()=>{
            if (res.data.data.url) {
              let qrcodeImg = res.data.data.url;
              that.setData({qrcodeImg: qrcodeImg,showPosterView: true});
              downLoadImg(qrcodeImg, 'qrcodeImg');
            }
          },200)
        } else {
          Api.wxShowToast('小程序码获取失败~', 'none', 2000)
        }
      })
      setTimeout(()=>{
        that.setData({
          showShare: false,
          maskHidden: true
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
      },2000)
  },
  //保存至相册
  saveImageToPhotosAlbum:function(){
    let that = this;
    wx.showToast({
      title: '保存中...',
      icon: 'loading',
      duration: 3200
    });
    setTimeout(()=>{
      wx.saveImageToPhotosAlbum({
        filePath: this.data.imagePath,
        success:(res)=>{
          let shareMoment = backApi.shareMoment+token;
          Api.wxRequest(shareMoment,'POST',{},(res)=>{
            // console.log(res,'momentttt')
            let points = res.data.data.points || 0;
            if (points) {
              Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~,可加3积分哦', 'none', 2500)
            } else {
              Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~', 'none', 2000)
            }
          })
          
          this.setData({
            maskHidden: false
          })
        },
        fail:(err)=>{
          that.setData({
            showDialog: true,
            openType: 'openSetting',
            authInfo: '需要获取相册权限才能保存图片哦'
          })
        }
      })
      if (!this.data.imagePath){
        wx.showModal({
          title: '提示',
          content: '图片绘制中，请稍后重试',
          showCancel:false
        })
      }
    },3000)
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
    let openType = that.data.openType;
    let userInfoApi = backApi.userInfo+token;
    that.setData({
      showDialog: false
    });
    // console.log(openType,'eeeopen')
    if (openType==='getUserInfo') {
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
        fail: (res)=>{
          wx.openSetting({
            success(settingdata) {
              if (settingdata.authSetting["scope.userInfo"]) {
                Api.wxShowToast("获取权限成功")
               } else {
                Api.wxShowToast("获取权限失败")
               }
            }
          })
          console.log(res, 'infocom')
          let errMsg = res.errMsg || '';
          // 
          if (errMsg === 'getUserInfo:fail auth deny') {
            
          }
          if (errMsg === 'getUserInfo:fail:auth denied') {
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
    } else {
      // Api.wxShowToast("获取权限成功，再次点击保存到相册",'none',2200)
      // wx.getSetting({
      //   success: (res) => {
      //     console.log(res, 'setting')
      //   }
      // })
      // wx.openSetting({
      //   success(settingdata) {
      //     if (settingdata.authSetting["scope.writePhotosAlbum"]) {
      //       Api.wxShowToast("获取权限成功，再次点击保存到相册",'none',2200)
      //      } else {
      //       Api.wxShowToast("获取权限失败",'none',2200)
      //      }
      //   }
      // })
    }
    
  },
  // 投票
  gotoVote (e) {
    let that = this;
    let page = that.data.page;
    let watchQuesApi = backApi.watchQuesApi+token;
    let noTopQuesApi = backApi.noTopQues+token;
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
      // let choose1 = '';
      // let choose2 = '';
      let qid = '';
      if (e.currentTarget.dataset.item) {
        // choose1 = e.currentTarget.dataset.item.choose1_per;
        // choose2 = e.currentTarget.dataset.item.choose2_per;
        qid = e.currentTarget.dataset.item.id;
      }
      
      let answerApi = backApi.u_answer;
      let page = that.data.page;
      answerData.qid = qid;
      
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
            Api.wxShowToast('投过票了', 'none', 300);
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

      if (direct==='userbase') {
        wx.navigateTo({
          url: `/pages/usercenter/usercenter`
        })
      }

      if (direct==='nobase') {
        setTimeout(()=>{
          that.setData({showUserbase: false})
        },2000)
      }
      
      setTimeout(()=>{
        that.slidethis(idx,qid,e.currentTarget.dataset.item);
        // that.setData({showUserbase: false})
        // if (idx === that.data.questionList.length-1) {
        //   that.setData({
        //     isEmpty: true
        //   })
        // }
      },3200)

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
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let language = userInfo.language || '';
    if (language) {
      let mid = e.target.dataset.mid;
      wx.navigateTo({
        url: `/pages/others/others?mid=${mid}`
      })
    } else {
      // 微信授权
      that.setData({
        showDialog: true
      })
    }
  },
  goShare (e) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let language = userInfo.language || '';
    if (language) {
      let quesId = e.target.dataset.question.id;
      let question = e.target.dataset.question.question;
      let avatar = '';
      let nname = '';
      if (e.target.dataset.question.member && e.target.dataset.question.member.avatar) {
        avatar = e.target.dataset.question.member.avatar
      } else {
        avatar = '../../images/avatarDefault.png';
      }
      // let avatar = e.target.dataset.question.member.avatar || '../../images/avatarDefault.png';
      if (e.target.dataset.question.member && e.target.dataset.question.member.nickname) {
        avatar = e.target.dataset.question.member.avatar
      } else {
        nname = '无名氏';
      }
      
      downLoadImg(avatar, 'headerUrl');
      that.setData({
        showShare: true,
        quesId: quesId,
        question: question,
        nname: nname,
        avatar: avatar
      })
    } else {
      // 微信授权
      that.setData({
        showDialog: true
      })
    }
  },
  gotoDetails (e) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let language = userInfo.language || '';
    if (language) {
      let id = e.target.dataset.id;
      wx.navigateTo({
        url: `/pages/details/details?id=${id}`
      })
    } else {
      // 微信授权
      that.setData({
        showDialog: true
      })
    }
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