const tabBar = require('../../components/tabBar/tabBar.js');
import WeCropper from '../../components/we-cropper/we-cropper.js'
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
// let token = '';
let publishedPoint = '';
let myPoint = '';
let ImgLock = '';
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
const isIphone = wx.getSystemInfoSync('isIphone');
let optionRtImage = '';
let optionLtImage = '';

Page({
  data: {
    showTextarea: false,
    isLeftDirect: '',
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
    viewWidth: 0,
    viewHeight: 0,
    pagePad: false,
    txtActive: true,
    leftImgTemp: '',
    rightImgTemp: '',
    showRightDele: false,
    showLeftDele: false,
    optionLtImage: '',
    optionRtImage: '',
    showCropper: false,
    adjustPosi: false,
    token: '',
    spacing: 0,
    openType: 'getUserInfo',
    authInfo: '需要微信授权登录才能更多操作哦',
    cropperData: {
      cropperOpt: {
        id: 'cropper',
        width,
        height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - 320) / 2,
          y: (height - 460) / 2,
          width: 320,
          height: 380
        }
      }
    }
    
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    let that = this;
    let token = that.data.token;
    let isLeftDirect = that.data.isLeftDirect;
    let uploadApi = backApi.uploadApi+token;

    that.wecropper.getCropperImage((src) => {
      if (src) {
        if (isLeftDirect) {
          that.setData({leftImgTemp: src,showLeftDele: true});
          wx.uploadFile({
            url: uploadApi,
            filePath: src,
            name: 'imageFile',
            formData:{},
            success: function(res){
              let data = JSON.parse(res.data);
              // console.log(data,'left img');
              let status = data.status*1;
              if (status===200) {
                // that.setData({optionLtImage: data.data.file_url});
                optionLtImage = data.data.file_url
              } else {
                Api.wxShowToast('图片上传失败~', 'none', 1400)
              }
            }
          })
        } else {
          that.setData({rightImgTemp: src,showRightDele: true})
          wx.uploadFile({
            url: uploadApi,
            filePath: src,
            name: 'imageFile',
            formData:{},
            success: function(res){
              let data = JSON.parse(res.data);
              // console.log(data,'right img');
              let status = data.status*1;
              if (status===200) {
                // that.setData({optionRtImage: data.data.file_url});
                optionRtImage = data.data.file_url
              } else {
                Api.wxShowToast('图片上传失败~', 'none', 1400)
              }
            }
          })
        }
        that.setData({showCropper: false})
        if (that.data.titleText && that.data.titleText!=='点击输入标题'&&that.data.showLeftDele&&that.data.showRightDele) {
          that.setData({isPublish:true,btnDis:false})
        }
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
      console.log(that.data.optionLtImage,that.data.optionLtImage,'imgggggg')
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
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
  cancelDialog () {
    let that = this;
    that.setData({
      showDialog: false
    })
  },
  confirmDialog (e) {
    let that = this;
    let token = that.data.token;
    let openType = that.data.openType;
    let userInfoApi = backApi.userInfo+token;
    that.setData({
      showDialog: false
    });
    if (openType==='getUserInfo') {
      wx.getUserInfo({
        success: (res)=>{
          let userInfo = res.userInfo;
          if (userInfo.nickName) {
            wx.setStorageSync('userInfo', userInfo);
            that.setData({
              uavatar: userInfo.avatarUrl,
              hasUserInfo: true
            });
            that.downLoadImg(userInfo.avatarUrl, 'avatarImgPath');
            // downLoadImg(userInfo.avatarUrl, 'headerUrl');
            backApi.getToken().then(function(response) {
              if (response.data.status*1===200) {
                let token = response.data.data.access_token;
                that.setData({token: token});
                let myInfo = backApi.myInfo+token;
                Api.wxRequest(myInfo,'GET',{},(res)=>{
                  if (res.data.status*1===200) {
                    myPoint = res.data.data.points;
                    ImgLock = res.data.data.release_img_lock*1;
                  }
                });
                Api.wxRequest(userInfoApi,'PUT',userInfo,(res)=> {
                  console.log(res.data.status, 'index update-user')
                })
              } else {
                Api.wxShowToast('网络出错了，请稍后再试哦~', 'none', 2000)
              }

            });
          }
        },
        fail: (res)=>{
          that.setData({
            showDialog: true,
            openType: 'openSetting',
            authInfo: '授权失败，需要微信权限哦'
          })
        }
      })
    } else {
    }
  },
  onLoad: function(option) {
    let that = this;
    tabBar.tabbar("tabBar", 2, that);//0表示第一个tabbar
    
    let model = isIphone.model;
      if (model.indexOf('iPhone') == -1) {
        that.setData({adjustPosi:true,spacing:140})
      }

    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        that.setData({winHeight: res.windowHeight});
      }
    })
    const { cropperOpt } = that.data.cropperData;

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  },
  onShow () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo.language) {
      backApi.getToken().then(function(response) {
        if (response.data.status*1===200) {
          let token = response.data.data.access_token;
          that.setData({
            showDialog: true,
            hasUserInfo: false,
            token: token
          })
        } else {
          Api.wxShowToast('网络出错了，请稍后再试哦~', 'none', 2000)
        }
      })

    } else {
      that.setData({
        uavatar: userInfo.avatarUrl
      });
      that.downLoadImg(userInfo.avatarUrl, 'avatarImgPath');
      backApi.getToken().then(function(response) {
        if (response.data.status * 1 === 200) {
          let token = response.data.data.access_token;
          that.setData({token: token});
          let myInfo = backApi.myInfo+token;
          Api.wxRequest(myInfo,'GET',{},(res)=>{
            if (res.data.status*1===200) {
              myPoint = res.data.data.points;
              ImgLock = res.data.data.release_img_lock*1;
            }
          })
        } else {
          Api.wxShowToast('网络出错了，请稍后再试哦~', 'none', 2000)
        }
      })
    }
  },
  textFocus () {
    let that =this;
    let title = that.data.titleText;
    if (title === '点击输入标题') {
      that.setData({
        showTextarea: true,
        titleText: ''
      })
    }
  },
  contFocus (e) {
    let that = this;
    let title = that.data.titleText;
    let direct = e.target.dataset.direct;
    let leftHolder = that.data.leftHolder;
    let rightHolder = that.data.rightHolder;
    if (direct === 'left' && leftHolder === '点击输入左选项') {
      if (title==='') {
        that.setData({
          titleText: '点击输入标题',
          showTextarea: false
        })
      }
      that.setData({
        showLeft: true,
        leftHolder: '',
        pagePad: true
      })
    }
    if (direct === 'right' && rightHolder === '点击输入右选项') {
      if (title==='') {
        that.setData({
          titleText: '点击输入标题',
          showTextarea: false
        })
      }
      that.setData({
        showRight: true,
        rightHolder: '',
        pagePad: true
      })
    }
  },
  titlePut (e) {
    let that = this;
    let val = e.detail.value;
    let direct = e.target.dataset.direct;
    // let chineseReg = /[\u4E00-\u9FA5]/g;
    let leftImg = that.data.leftImgTemp;
    let rightImg = that.data.rightImgTemp;
    console.log(val,'text')
    if (val==='') {
      that.setData({isPublish: false})
    } else {
      if (direct === 'title' && val !== '点击输入标题') {
        that.setData({
          titleText: val,
          shareTitle: val
        })
        if (val.length>=30) {
          Api.wxShowToast('标题不超过30个字', 'none', 2000);
        }
      }
      if (!that.data.txtActive) {
        if (leftImg && rightImg && val !== '点击输入标题' && val !== '') {
          that.setData({isPublish: true,btnDis:false})
        }
      } else {
        if (direct === 'left') {
          that.setData({
            leftText: val
          })
          if (val.length>=18) {
            Api.wxShowToast('左选项不超过18个字', 'none', 2000);
          }
        }
        if (direct === 'right') {
          that.setData({
            rightText: val
          })
          if (val.length>=18) {
            Api.wxShowToast('右选项不超过18个字', 'none', 2000);
          }
        }
        if (that.data.titleText !== '点击输入标题' && that.data.titleText.length>1 && that.data.leftText !== '' && that.data.rightText !== '') {
          that.setData({
            isPublish: true,btnDis:false
          })
        }
      }
    }

  },
  // 上传图片
  chooseImg (e) {
    let that = this;
    let imgopt = e.currentTarget.dataset.imgopt;
    
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({showCropper: true});
        that.wecropper.pushOrign(tempFilePaths[0]);
        if (imgopt==='left') {
          that.setData({isLeftDirect:true})
        } else {
          that.setData({isLeftDirect:false})
        }
        if (that.data.leftImgTemp && that.data.rightImgTemp && (that.data.titleText !== '点击输入标题' && that.data.titleText !== '')) {
          that.setData({
            isPublish: true,btnDis:false
          })
        } else {
          that.setData({
            isPublish: false
          })
        }
        
      }
    })
  },
  // 点击发布
  goPublish () {
    let publishApi = backApi.publishApi;
    let that = this;
    let txtActive = that.data.txtActive;
    let leftImgTemp = that.data.leftImgTemp;
    let rightImgTemp = that.data.rightImgTemp;
    let token = that.data.token;
    let isPublish = that.data.isPublish;
    
    if (txtActive) { //上传文字
      if (that.data.titleText === '点击输入标题' && that.data.leftText === '' && that.data.rightText === '') {
        let wxShowToast = Api.wxShowToast('请填写基本内容', 'none', 2000);
        return false;
      }
      if (that.data.titleText === '' || that.data.titleText === '点击输入标题') {
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
        question: that.data.titleText.replace(/\s/g, "").substring(0,30),
        option1: that.data.leftText.replace(/\s/g, "").substring(0,36),
        option2: that.data.rightText.replace(/\s/g, "").substring(0,36),
        type: 1
      }

      that.setData({
        btnDis: true
      })

      if (isPublish) {
        Api.wxRequest(publishApi+token,'POST',postData,(res)=>{
          // that.setData({
          //   isPublish: false
          // })
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
      } else {
        that.setData({
          btnDis: true
        });
        Api.wxShowToast('请填写完整哦', 'none', 2000);
      }
    } else { //上传图片
      if (that.data.titleText === '点击输入标题' && leftImgTemp === '' && rightImgTemp === '') {
        let wxShowToast = Api.wxShowToast('请填写基本内容', 'none', 2000);
        return false;
      }
      if (that.data.titleText === '' || that.data.titleText === '点击输入标题') {
        let wxShowToast = Api.wxShowToast('请填写标题', 'none', 2000);
        return false;
      }
      if (leftImgTemp==='') {
        Api.wxShowToast('请上传左边图片', 'none', 2000);
        return false;
      }
      if (rightImgTemp==='') {
        Api.wxShowToast('请上传右边图片', 'none', 2000);
        return false;
      }
      // let leftImg =  that.data.optionLtImage;
      // let rightImg =  that.data.optionRtImage;
      let postData = {
        question: that.data.titleText.replace(/\s/g, "").substring(0,30),
        option1: optionLtImage,
        option2: optionRtImage,
        type: 2
      }
      that.setData({
        btnDis: true
      })
      if (isPublish) {
        Api.wxRequest(publishApi+token,'POST',postData,(res)=>{
          // that.setData({
          //   isPublish: false
          // })
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
              isPublish: false,
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
          }
          if (status === 201) {
            publishedPoint = res.data.data.member.points;
            wx.hideLoading();
            if (publishedPoint===myPoint) {
              Api.wxShowToast('发布成功', 'success', 2000);
              that.setData({
                qid: res.data.data.id,
                showToast: false,
                isPublish: false,
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
            } else {
              setTimeout(()=> {
                that.setData({
                  qid: res.data.data.id,
                  showToast: true,
                  isPublish: false,
                  btnDis: false
                });

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
      } else {
        that.setData({
          btnDis: true
        })
        Api.wxShowToast('请提交完整信息哦', 'none', 2000);
      }
    }
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
    },100)
  },
  onShareAppMessage () {
    let that = this;
    let questId = that.data.qid;
    let token = that.data.token;
    let shareFriends = backApi.shareFriends+'?access-token='+token;
    return {
      title: that.data.shareTitle,
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
    }, 3500)
  },
  shareTomoment () {
    let that = this;
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1500
    });
    let token = this.data.token;
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
                    that.downLoadImg(res.data.data.url, 'qrcodeImgPath');
                    that.setData({
                      qrcode: qrcodeImg
                    })
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
    context.drawImage(path, 0, 0, 375, 154);

    var path3 = "/images/my_bg.jpg";
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
    context.setFontSize(14);
      context.setFillStyle('#888888');
        context.setTextAlign('center');
        context.fillText('长按识别小程序 表达你的观点哟', 190, 550);
        context.stroke();
    //绘制右下角扫码提示语
    context.drawImage('../../images/posterArrow.png', 180, 570, 10, 6);
    let path1 = that.data.avatarImgPath;
    let qrcodeImg = that.data.qrcodeImgPath;
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
          console.log(res, 'index canvas')
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
    let that = this;
    let token = this.data.token;
    setTimeout(()=>{
      if (!that.data.imagePath){
        wx.showModal({
          title: '提示',
          content: '图片绘制中，请稍后重试',
          showCancel:false
        })
      }
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imagePath,
        success:(res)=>{
          let shareMoment = backApi.shareMoment+token;
          Api.wxRequest(shareMoment,'POST',{},(res)=>{
            let points = res.data.data.points || 0;
            if (points) {
              Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~,可加3积分哦', 'none', 2500)
              setTimeout(()=> {
                wx.navigateBack({
                  delta: 1
                })
              }, 9500)
            } else {
              Api.wxShowToast('图片已保存到相册，赶紧晒一下吧~', 'none', 2000)
              setTimeout(()=> {
                wx.navigateBack({
                  delta: 1
                })
              }, 9500)
            }
          })
          that.setData({
            maskHidden: false
          });
        },
        fail:(err)=>{
          that.setData({
            showDialog: true,
            openType: 'openSetting',
            authInfo: '需要获取相册权限才能保存图片哦'
          })
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
      if (title==='') {
        that.setData({
          titleText: '点击输入标题',
          showTextarea: false
        })
      }
      that.setData({
        leftHolder: '点击输入左选项',
        showLeft: false,
        
      })
    }
    if (rightText === '' && direct === 'right') {
      if (title==='') {
        that.setData({
          titleText: '点击输入标题',
          showTextarea: false
        })
      }
      that.setData({
        rightHolder: '点击输入右选项',
        showRight: false
      })
    }
    console.log(title,leftText,rightText,'blur')
    if (that.data.txtActive) {
      if (title===''||leftText===''||rightText===''){
        that.setData({
          isPublish: false
        })
      }
      if (leftText&&rightText&&title&&title!=='点击输入标题') {
        that.setData({
          isPublish: true
        })
      }
    }

  },
  // 输入框
  textTap (e) {
    let that = this;
    let title = that.data.titleText;
    let leftHolder = that.data.leftHolder;
    let direct = e.currentTarget.dataset.direct;
    let rightHolder = that.data.rightHolder;
    // console.log(title, 'teee')
    if (title === '点击输入标题' && direct === 'title') {
      that.setData({
        titleText: '',
        showTextarea: true
      })
    }
    if (leftHolder === '点击输入左选项' && direct === 'left') {
      that.setData({
        leftHolder: '',
        showLeft: true,
        pagePad: false
      })
    }
    if (rightHolder === '点击输入右选项' && direct === 'right') {
      that.setData({
        rightHolder: '',
        showRight: true,
        pagePad: false
      })
    }
  },
  changeTab (e) {
    console.log(e,ImgLock,'2222')
    let that = this;
    let tab = e.currentTarget.dataset.tab;
    let titleText = that.data.titleText;
    let leftImgTemp = that.data.leftImgTemp;
    let rightImgTemp = that.data.rightImgTemp;
    if (tab==='text') {
      that.setData({txtActive:true})
      if (titleText === '点击输入标题' || that.data.leftText === '' || that.data.rightText === '') {
        that.setData({isPublish:false})
      }
      if ((titleText !== '点击输入标题' && titleText !== '') && that.data.leftText === '' && that.data.rightText === '') {
        that.setData({isPublish:true,btnDis:false})
      }

    } else {
      if (ImgLock===1) {
        Api.wxShowToast("发文字选项，获3票 解锁发图", 'none', 2200)
      }
      if (ImgLock===2) {
        that.setData({txtActive:false})
        if (titleText === '点击输入标题' || leftImgTemp === '' || rightImgTemp === '') {
          that.setData({isPublish:false})
        }
        if ((titleText !== '点击输入标题' && titleText !== '') && leftImgTemp !== '' && rightImgTemp !== '') {
          that.setData({isPublish:true,btnDis:false})
        }
      }
      
    }
  },
  // 删除图片
  deleImage (e) {
    console.log(e, 'eee')
    let that = this;
    let opt = e.target.dataset.opt;
    if (opt==='left') {
      that.setData({leftImgTemp: '',showLeftDele: false,isPublish:false})
    }
    if (opt==='right') {
      that.setData({rightImgTemp: '',showRightDele: false,isPublish:false})
    }
  },
  downLoadImg:  function(url, name) {
    var that = this;
    wx.getImageInfo({
      src: url,    //请求的网络图片路径
      success: function (res) {
        if (name == 'avatarImgPath') {
          that.setData({
            avatarImgPath: res.path,
          });
        } else if (name == 'qrcodeImgPath') {
          that.setData({
            qrcodeImgPath: res.path,
          });
        }

      }
    })
  }
});