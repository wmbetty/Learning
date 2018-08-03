function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = res => resolve(res)
      obj.fail = err => reject(err)
      fn(obj)
    })
  }
}

/**
 * 获取微信用户信息
 * 必须在登录之后调用
 */
function wxGetUserInfo() {
  return wxPromisify(wx.getUserInfo)
}

/**
 获取用户的当前设置
 */
function wxGetSetting() {
  return wxPromisify(wx.getSetting)
}

/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return wxPromisify(wx.getSystemInfo)
}

/**
 * 消息提示
 */
function wxShowToast(title, icon, duration) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}

/**
 * 显示模态弹窗
 */
function wxShowModal(title, txt, showCancel, callback) {
  wx.showModal({
    confirmText: '确认',
    title: title,
    content: txt,
    confirmColor: '#E74C49',
    showCancel: showCancel,
    success: (res) => {
      callback(res)
    }
  })
}

/**
 * 发起请求
 */
function wxRequest(url, method, data={}, callback) {
  wx.request({
    url: url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
      // 'content-type': 'application/x-www-form-urlencoded'
    },
    success: (res) => {
      callback(res)
    },
    fail: (res) => {
      console.log(res)
    }
  })
}

module.exports = {
  wxPromisify: wxPromisify,
  wxGetUserInfo: wxGetUserInfo,
  wxGetSystemInfo: wxGetSystemInfo,
  wxGetSetting: wxGetSetting,
  wxRequest: wxRequest,
  wxShowToast: wxShowToast,
  wxShowModal: wxShowModal
}