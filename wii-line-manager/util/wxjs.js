function postRequest(url, data, callback) {
    wx.request({
        url: url,
        method:'POST',
        data: data,
        header: {
            // 'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
            callback(res)
        }
      })
}

// 操作提示
function showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  }

// loading
function showLoading (title) {
    wx.showLoading({
        title: title,
        mask:true
      })
}

module.exports = {
    postRequest: postRequest,
    showToast: showToast,
    showLoading: showLoading
}