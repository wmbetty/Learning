const tabBar = require('../../components/tabBar/tabBar.js');
const Api = require('../../wxapi/wxApi');

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
    titleText: ''
  },
  onLoad: function(option) {
    tabBar.tabbar("tabBar", 2, this);//0表示第一个tabbar
    let wxGetSystemInfo = Api.wxGetSystemInfo();
    wxGetSystemInfo().then(res => {
      if (res.windowHeight) {
        this.setData({viewHeight: res.windowHeight});
      }
    })
  },
  textFocus () {
    this.setData({
      showTextarea: true
    })
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
    // 标题字数限制
    if (val.trim().length > 30) {
      console.log('超出了')
    }
    if (direct === 'title') {
      that.setData({
        titleText: val
      })
    }
    if (direct === 'left') {
      that.setData({
        leftText: val
      })
    }
    if (direct === 'right') {
      that.setData({
        rightText: val
      })
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
    let that = this;
    if (that.data.titleText === '' && that.data.leftText === '' && that.data.rightText === '') {
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
    console.log(11)
  }
});