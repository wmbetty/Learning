Component({properties:{msgCount:{type:Number,value:0},voteUnreadCount:{type:Number,value:0},baseRedDot:{type:Number,value:0},commentTotal:{type:Number,value:0}}})
function tabbarinit(){return[{"current":0,"pagePath":"/pages/main/main","iconPath":"/images/main.png","selectedIconPath":"/images/main_act.png","text":"选象"},{"current":0,"pagePath":"/pages/index/index","iconPath":"/images/add_bigIcon.png","selectedIconPath":"/images/add_bigIcon.png"},{"current":0,"pagePath":"/pages/mine/mine","iconPath":"/images/my.png","selectedIconPath":"/images/my_act.png","text":"我"}]}
function tabbarmain(bindName="tabdata",id,target){var that=target;var bindData={};var otabbar=tabbarinit();otabbar[id]['iconPath']=otabbar[id]['selectedIconPath']
  otabbar[id]['current']=1;bindData[bindName]=otabbar
  that.setData({bindData});}
module.exports={tabbar:tabbarmain}