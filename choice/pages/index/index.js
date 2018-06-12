const tabBar = require('../../components/tabBar/tabBar.js');
const backApi = require('../../utils/util');
const Api = require('../../wxapi/wxApi');
const app = getApp();
let token = '';

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
    isShare: false
  },
  onLoad: function(option) {
    tabBar.tabbar("tabBar", 2, this);//0表示第一个tabbar
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({winHeight: res.windowHeight});
      }
    })
    setTimeout(()=>{
      token = app.globalData.access_token;
    }, 1200)
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
    if (direct === 'left' && that.data.leftHolder === '点击输入左选项') {
      that.setData({
        showLeft: true,
        leftHolder: ''
      })
    }
    if (direct === 'right' && that.data.rightHolder === '点击输入右选项') {
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
          titleText: val
        })
        if (chineseReg.test(val)) {
          if (val.match(chineseReg).length >= 30) {  //返回中文的个数  
            let wxShowToast = Api.wxShowToast('标题字数超出限制', 'none', 2000);  
            return false;  
          }  
        }
      }
    }
    if (direct === 'left') {
      if (val) {
        that.setData({
          leftText: val
        })
        if (chineseReg.test(val)) {
          if (val.match(chineseReg).length >= 36) {  //返回中文的个数  
            let wxShowToast = Api.wxShowToast('左选项字数超出限制', 'none', 2000);  
            return false;  
          }  
        }
      }
    }
    if (direct === 'right') {
      if (val) {
        that.setData({
          rightText: val
        })
      }
      if (chineseReg.test(val)) {
        if (val.match(chineseReg).length >= 36) {  //返回中文的个数  
          let wxShowToast = Api.wxShowToast('左选项字数超出限制', 'none', 2000);  
          return false;  
        }  
      }
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
      question: that.data.titleText,
      option1: that.data.leftText,
      option2: that.data.rightText
    }
    Api.wxRequest(publishApi+token,'POST',postData,(res)=>{
      let status = res.data.status*1;
      if (status === 201) {
        that.setData({
          showToast: true
        });
        // 2s后消失
        setTimeout(() => {
          that.setData({
            showToast: false,
            // isShare: true,
            leftHolder: '',
            rightHolder: '',
            titleText: ''
          });
        }, 2000)
      }
    })
  },
  // 取消分享
  cancelShare () {
    this.setData({
      isShare: false
    });
  }
});