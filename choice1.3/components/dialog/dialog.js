Component({properties:{dialogShow:{type:Boolean,value:false},openType:{type:String,value:'getUserInfo'},authInfo:{type:String,value:'需要微信授权登录才能更多操作哦'}},data:{},methods:{confirmDialog(){var myEventDetail={}
      var myEventOption={}
      this.triggerEvent('confirmDialog',myEventDetail,myEventOption)},cancelDialog(e){var myEventDetail={}
      var myEventOption={}
      this.triggerEvent('cancelDialog',myEventDetail,myEventOption)}}})