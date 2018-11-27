function initializePageAction(tab) {
  if (tab.url.indexOf("vk.com")!=-1) {
    browser.pageAction.show(tab.id);
  }
}
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

function sendBackground(tabId){
  //alert("sendBackground sending to tab "+tabId);
  //chrome.tabs.sendMessage(tab.id, {from:'background savestories'}, function(response) {alert(response.name);});
  chrome.tabs.sendMessage(tabId, {from:'background savestories'});
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
      var views = chrome.extension.getViews({type: "popup"});
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
    if(message.tabId)
    sendBackground(message.tabId);
    break;
    default:
  }
}
chrome.runtime.onMessage.addListener(backgroundListen);
