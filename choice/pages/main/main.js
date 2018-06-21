// pages/main/main.js
const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';
let isPhoto;
// let userDeny = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 800,
    duration: 400,
    viewHeight: 0,
    currentIndex: 0,
    numActive: false,
    choose1_orgin: 0,
    choose2_orgin: 0,
    showMask: false,
    chooseData:[],
    showShare: false,
    touxiang:"../../images/bg.png",
    path2:"../../images/my_bg.jpg",
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
    page: 1
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
    } else {
      return text
    }
  },
  onLoad: function (options) {
    let that = this;
    tabBar.tabbar("tabBar", 0, that);
    let questId = wx.getStorageSync('quesid');
    if (questId) {
      wx.navigateTo({
        url: `/pages/details/details?id=${questId}`
      })
    }
    wx.showLoading({
      title: '加载中',
    });
  },
  onReady: function () {
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },
  onShow: function () {
    let that = this;
    // app.js onLunch为异步事件
    setTimeout(()=>{
      token = wx.getStorageSync('token');
      let watchQuesApi = backApi.watchQuesApi+token;
      let page = that.data.page;
      
      // console.log(token)
      Api.wxRequest(backApi.questions+token, 'GET', {page: page}, (res)=>{
        let datas = res.data.data || [];
        wx.hideLoading();
        // if (datas.length===0) {
        //   that.setData({
        //     isEmpty: true
        //   })
        // }
        if (datas.length > 0) {
          for (let item of datas) {
            item.option1 = item.option1.substring(0, 36);
            item.option2 = item.option2.substring(0, 36);
            item.question = item.question.substring(0, 30);
          }
          // console.log(datas, 'data')
          Api.wxRequest(watchQuesApi,'POST',{qid: datas[0].id}, (res)=> {
            // console.log(res, 'watch')
            if (res.data.status*1===201) {
              console.log('watched')
            }
          })
          that.setData({chooseData: datas});
        } else if (datas.length===0) {
          let noTopQuesApi = backApi.noTopQues+token;
          Api.wxRequest(noTopQuesApi, 'GET', {}, (res)=>{
            console.log(res, 'sss')
            let datas = res.data.data;
            if (datas.length > 0) {
              for (let item of datas) {
                item.option1 = that.textNumTest(item.option1);
                item.option2 = that.textNumTest(item.option2);
              }
              Api.wxRequest(watchQuesApi,'POST',{qid: datas[0].id}, (res)=> {
                // console.log(res, 'watch')
                if (res.data.status*1===201) {
                  console.log('watched')
                }
              })
              that.setData({chooseData: datas});
            } else {
              that.setData({
                isEmpty: true
              })
            }
          })
        }else {
          Api.wxShowToast('数据出错了', 'none', 2000);
        }
      })
    },80)
    let msgCount = wx.getStorageSync('msgTotal');
    let voteUnreadCount = wx.getStorageSync('voteUnreadCount');
      that.setData({
        msgCount: msgCount,
        voteUnreadCount: voteUnreadCount
      })
      
      wx.getSetting({
        success: (res) => {
          // console.log(res, 'minemine')
          let authSetting = res.authSetting;
          let writePhotosAlbum = authSetting["scope.writePhotosAlbum"] || '';
          if (writePhotosAlbum) {
            isPhoto = true
          } else {
            isPhoto = false
          }
        }
      })
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage () {
    let that = this;
    let questId = that.data.quesId;
    let shareFriends = backApi.shareFriends+'?access-token='+token;
    return {
      title: '有选象 不纠结',
      path: `/pages/main/main?qid=${questId}`,
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
  onPageScroll () {
    wx.setNavigationBarTitle({
      title: '选象'
    });
  },
  // 轮播图切换事件
  currentChange (e) {
    let that = this;
    let chooseDatas = that.data.chooseData;
    let watchQuesApi = backApi.watchQuesApi+token;
    let current = e.detail.current;
    for (let i=0;i<chooseDatas.length;i++) {
      if (i===current*1) {
        let watchQid = chooseDatas[i].id;
        Api.wxRequest(watchQuesApi,'POST',{qid: watchQid}, (res)=> {
          console.log(res, 'watch')
          if (res.data.status*1===201) {
            console.log(current, chooseDatas.length-1, 'llll')
            if (current===chooseDatas.length-1) {
              console.log('top该分页了')
              let noTopQuesApi = backApi.noTopQues+token;
              let page = that.data.page;
              setTimeout(()=>{
                Api.wxRequest(backApi.questions+token, 'GET', {page: page+1}, (res)=>{
                  // console.log(res, 'rssssleng')
                  if (res.data.status*1 === 200) {
                    that.setData({page: page+1});
                    let topDatas = res.data.data || [];
                    wx.hideLoading();
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
                              item.option1 = that.textNumTest(item.option1);
                              item.option2 = that.textNumTest(item.option2);
                            }
                            chooseDatas = chooseDatas.concat(datas);
                            that.setData({chooseData: chooseDatas});
                          } else {
                            Api.wxShowToast('没有数据了，去发布吧', 'none', 2000);
                          }
                        }
                      })
                    } else {
                      for (let item of topDatas) {
                        item.option1 = that.textNumTest(item.option1);
                        item.option2 = that.textNumTest(item.option2);
                      }
                      chooseDatas = chooseDatas.concat(topDatas);
                      // console.log(chooseDatas, 'chsss')
                      that.setData({chooseData: chooseDatas});
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
    // console.log(current,chooseDatas, 'change')
    
    
  },
  // 到他人中心
  gotoOthers (e) {
    // console.log(e, 'otherss')
    let mid = e.target.dataset.mid;
    wx.navigateTo({
      url: `/pages/others/others?mid=${mid}`
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
        console.log(res, 'getInfooomain')
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
          
        }
      }
    })
  },
  goVote (e) {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let language = userInfo.language || '';
    // console.log(userInfo, 'infomain')
    let answerData = {
      qid: 0,
      choose: ''
    }
    // 判断是否授权
    if (language) {
      let chooseData = that.data.chooseData;
      let choose1_orgin = that.data.choose1_orgin;
      let choose2_orgin = that.data.choose2_orgin;
      let direct = e.currentTarget.dataset.direct;
      let choose1 = e.currentTarget.dataset.item.choose1_per;
      let choose2 = e.currentTarget.dataset.item.choose2_per;
      let data_index = e.currentTarget.dataset.index;
      let qid = e.currentTarget.dataset.item.id;
      let answerApi = backApi.u_answer;
      answerData.qid = qid;

      // 1.判断是否投过票了
      for (let i = 0;i<chooseData.length;i++) {
        if (chooseData[i].showMask && data_index === i) {
          Api.wxShowToast('这个问题已经投过票了，下一题吧', 'none', 2000);
          that.setData({currentIndex: data_index+1});
          return false;
        }
      }

      // 4.投票请求
      // console.log(answerData, 'daaaa')
      if (direct === 'left') {
        answerData.choose = 1;
      }
      if (direct === 'right') {
        answerData.choose = 2;
      }
      Api.wxRequest(answerApi+token,'POST',answerData,(res)=>{
        let status = res.data.status*1;
        
        // console.log(res.data, 'choose')
        // 投票成功后
        if (status === 201) {

          let afterChoose = res.data.data;
          // console.log(afterChoose, 'oose')
          
          if (direct === 'left') {
            for (let i = 0;i<chooseData.length;i++) {
              if (data_index === i) {
                chooseData[i].hots = afterChoose.hots;
                chooseData[i].choose_left = true;
                chooseData[i].showMask = true;
                let chse1 = afterChoose.choose1_per;
                let chse2 = afterChoose.choose2_per;
                // console.log(choose1,choose2, 'pereeeer')
                if (chse1 === 0) {
                  
                  let timer1 = setInterval(()=>{
                    if (chse2 >= 20) {
                      choose2_orgin=choose2_orgin+2;
                    } else {
                      choose2_orgin=choose2_orgin+3;
                    }
                    chooseData[i].choose1_per = chse1;
                    chooseData[i].choose2_per = choose2_orgin;
                    that.setData({
                      chooseData: chooseData
                    })
                    if(choose2_orgin >= chse2){
                      clearInterval(timer1);
                      chooseData[i].choose2_per = chse2;
                      that.setData({
                        chooseData: chooseData
                      })
                    }
                  }, 15);
                }
                if (chse2 === 0) {
                  
                  let timer1 = setInterval(()=>{
                    if (chse1 >= 20) {
                      choose1_orgin=choose1_orgin+2;
                    } else {
                      choose1_orgin=choose1_orgin+3;
                    }
                    chooseData[i].choose1_per = choose1_orgin;
                    chooseData[i].choose2_per = chse2;
                    that.setData({
                      chooseData: chooseData
                    })
                    if(choose1_orgin >= chse1){
                      clearInterval(timer1);
                      chooseData[i].choose1_per = chse1;
                      that.setData({
                        chooseData: chooseData
                      })
                    }
                    
                  }, 15);
                }
                if (chse1 !== 0 && chse2 !== 0) {
                  let timer1 = setInterval(()=>{
                    if (chse1 >= 20) {
                      choose1_orgin=choose1_orgin+2;
                    } else {
                      choose1_orgin=choose1_orgin+3;
                    }
                    if (chse2 >= 20) {
                      choose2_orgin=choose2_orgin+2;
                    } else {
                      choose2_orgin=choose2_orgin+3;
                    }
                    chooseData[i].choose1_per = choose1_orgin;
                    chooseData[i].choose2_per = choose2_orgin;
                    that.setData({
                      chooseData: chooseData
                    })
                    if(choose1_orgin >= choose1){
                      clearInterval(timer1);
                      chooseData[i].choose1_per = chse1;
                      chooseData[i].choose2_per = chse2;
                      that.setData({
                        chooseData: chooseData
                      })
                    }
                  }, 15);
                }
                
              }
            }
          }

          if (direct === 'right') {
            for (let i = 0;i<chooseData.length;i++) {
              if (data_index === i) {
                chooseData[i].hots = afterChoose.hots;
                chooseData[i].choose_right = true;
                chooseData[i].showMask = true;
                let chse1 = afterChoose.choose1_per;
                let chse2 = afterChoose.choose2_per;
                // console.log(choose1,choose2, 'pereeeer')
                if (chse1 === 0) {
                  
                  let timer1 = setInterval(()=>{
                    if (chse2 >= 20) {
                      choose2_orgin=choose2_orgin+2;
                    } else {
                      choose2_orgin=choose2_orgin+3;
                    }
                    chooseData[i].choose1_per = chse1;
                    chooseData[i].choose2_per = choose2_orgin;
                    that.setData({
                      chooseData: chooseData
                    })
                    if(choose2_orgin >= chse2){
                      clearInterval(timer1);
                      chooseData[i].choose2_per = chse2;
                      that.setData({
                        chooseData: chooseData
                      })
                    }
                  }, 15);
                }
                if (chse2 === 0) {
                  
                  let timer1 = setInterval(()=>{
                    if (chse1 >= 20) {
                      choose1_orgin=choose1_orgin+2;
                    } else {
                      choose1_orgin=choose1_orgin+3;
                    }
                    chooseData[i].choose1_per = choose1_orgin;
                    chooseData[i].choose2_per = chse2;
                    that.setData({
                      chooseData: chooseData
                    })
                    if(choose1_orgin >= chse1){
                      clearInterval(timer1);
                      chooseData[i].choose1_per = chse1;
                      that.setData({
                        chooseData: chooseData
                      })
                    }
                    
                  }, 15);
                }
                if (chse1 !== 0 && chse2 !== 0) {
                  let timer2 = setInterval(()=>{
                    if (chse2 >= 20) {
                      choose2_orgin=choose2_orgin+2;
                    } else {
                      choose2_orgin=choose2_orgin+3;
                    }
                    if (chse1 >= 20) {
                      choose1_orgin=choose1_orgin+2;
                    } else {
                      choose1_orgin=choose1_orgin+3;
                    }
                    chooseData[i].choose1_per = choose1_orgin;
                    chooseData[i].choose2_per = choose2_orgin;
                    that.setData({
                      chooseData: chooseData
                    })
                    if(choose2_orgin >= choose2){
                      clearInterval(timer2);
                      chooseData[i].choose1_per = chse1;
                      chooseData[i].choose2_per = chse2;
                      that.setData({
                        chooseData: chooseData
                      })
                    }
                  }, 15);
                }
              }
            }
          }
          setTimeout(() => {
            that.setData({currentIndex: data_index+1});
          },4000)
        }
        if (status===444) {
          let msg = res.data.msg;
          if (msg.indexOf('has already been taken') != -1) {
            Api.wxShowToast('这个问题投过票了，下一题吧', 'none', 2000);
          }
        }
      })
    } else {
      that.setData({
        showDialog: true
      })
    }
  },
  goShare (e) {
    let that = this;
    let quesId = e.target.dataset.question.id;
    let question = e.target.dataset.question.question;
    let avatar = e.target.dataset.question.member.avatar;
    downLoadImg(avatar, 'headerUrl');
    that.setData({
      showShare: true,
      quesId: quesId,
      question: question
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
  cancelPoster () {
    let that = this;
    that.setData({
      maskHidden: false
    })
  },
  shareToMoment () {
    let that = this;
    that.setData({
      showShare: false,
      maskHidden: true
    })
    let shareQues = that.data.question;
    let chineseReg = /[\u4E00-\u9FA5]/g;
    let shareTitle1 = '';
    let shareTitle2 = '';
    var context = wx.createCanvasContext('mycanvas');
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 46, 375, 600)
    that.drawRoundRect(context, 0, 46, 375, 600, 8);
    let path1 = wx.getStorageSync('headerUrl');
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
    } else {
        context.setFontSize(20);
        context.setFillStyle('#62559D');
        context.setTextAlign('center');
        context.fillText(shareQues, 185, 280);
        context.stroke();
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
  //保存至相册
  saveImageToPhotosAlbum:function(){
    
    if (isPhoto) {
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
          Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~', 'none', 2000)
          this.setData({
            maskHidden: false
          })
        },
        fail:(err)=>{
          if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {}
          console.log(err,'err')
        }
      })
    } else {
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