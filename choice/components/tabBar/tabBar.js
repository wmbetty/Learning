// components/tabBar/tabBar.js
//初始化数据
function tabbarinit() {
  return [
       { "current":0,
         "pagePath": "/pages/main/main",
         "iconPath": "/imgs/home.png",
         "selectedIconPath": "/imgs/home_on.png",
         "text": "选象"
       },
       {
         "current": 0,
         "pagePath": "/pages/news/news",
         "iconPath": "/imgs/message.png",
         "selectedIconPath": "/imgs/message_on.png",
         "text": "消息"
 
       },
       {
         "current": 0,
         "pagePath": "/pages/index/index",
         "iconPath": "/imgs/category.png",
         "selectedIconPath": "/imgs/category_on.png"
       },
       {
         "current": 0,
         "pagePath": "/pages/mine/mine",
         "iconPath": "/imgs/buy.png",
         "selectedIconPath": "/imgs/buy_on.png",
         "text": "我"
       }
     ]
 
 }
 //tabbar 主入口
 function tabbarmain(bindName = "tabdata", id, target) {
   var that = target;
   var bindData = {};
   var otabbar = tabbarinit();
   otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
   otabbar[id]['current'] = 1;
   bindData[bindName] = otabbar
   that.setData({ bindData });
 }
 
 module.exports = {
   tabbar: tabbarmain
 }
