/*
browser.runtime.onInstalled.addListener(function () {
  browser.declarativeContent.onPageChanged.removeRules(undefined, function() {
    browser.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new browser.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'vk.com' },
          })
        ],
        actions: [ new browser.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});*/

  //const filter={urls:["*://*.vk.com/*"]};
  function backgroundTabsUpdate(tabId, changeInfo, tabInfo){
    if(changeInfo.url){
      let url=changeInfo.url;
      let index = url.indexOf("vk.com/");

      if(index!=-1){
        let key=url[index-1];
        if((key=='.')||(key=='/')){
          browser.pageAction.show(tabId);
          return;
        }
      }
      browser.pageAction.hide(tabId);
    }
  }
  browser.tabs.onUpdated.addListener(backgroundTabsUpdate);

function sendBackground(tabId, download=null){
  //alert("sendBackground sending to tab "+tabId);
  //browser.tabs.sendMessage(tab.id, {from:'background savestories'}, function(response) {alert(response.name);});
  let message={};
  if(download){
    message.download=download;
  }
  message.from='background savestories';
  browser.tabs.sendMessage(tabId, message);
}

function backgroundListen(message){
  //alert('background listener');
  if(message.from)
  switch (message.from) {

    case 'content savestories':
    //alert('message from content');
    if(message.popupBody!='none'){
      //alert('background received non-null popupBody');
      //alert(message.popupBody);
      var views = browser.extension.getViews({type: "popup"});
      for (var i in views) {
        views[i].document.body.innerHTML = message.popupBody;
      }
    }
    else {
      //alert('no message.popupBody!');
    }
    break;

    case 'popup savestories':
    //alert('message from popup');
    if(message.tabId){
      if(message.download){
        sendBackground(message.tabId, message.download);
        break;
      }
      sendBackground(message.tabId);
    }
    break;

    default:
  }
}
browser.runtime.onMessage.addListener(backgroundListen);
