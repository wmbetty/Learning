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
    isMy: false,
    ismyVoted: false,
    choose1_orgin: 0,
    choose2_orgin: 0,
    showVoteMsk: false,
    rightRed: false,
    leftRed: false,
    hots: 0,
    showDialog: false,
    hasVoted: false
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
    qid = options.id;
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
        } else {
          Api.wxShowToast('网络错误，请重试', 'none', 300);  
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
        this.setData({winHeight: res.windowHeight});
      }
    })
    wx.setNavigationBarColor({
      frontColor:'#000000',
       backgroundColor:'#F5F6F8'
    })
  },
  onReady: function () {},
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
  onShareAppMessage: function () {
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
    downLoadImg(that.data.details.member.avatar, 'headerUrl');
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
    // this.setData({
    //   showMask: false,
    //   maskHidden: true
    // })
  },
  //保存至相册
  saveImageToPhotosAlbum:function(){
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

        Api.wxRequest(answerApi+token,'POST',answerData,(res)=>{
          let status = res.data.status*1;
          console.log(res.data, 'choose')
          // 
          if (status === 201) {
            that.setData({
              hasVoted: true
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