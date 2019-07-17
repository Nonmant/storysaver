chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'vk.com' }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function sendBackground(tabId) {
  //alert("sendBackground sending to tab "+tabId);
  //chrome.tabs.sendMessage(tab.id, {from:'background savestories'}, function(response) {alert(response.name);});
  chrome.tabs.sendMessage(tabId, { from: 'background savestories' });
}

function backgroundListen(message) {
  //alert('background listener');
  if (message.from)
    switch (message.from) {
      case 'content savestories':
        //alert('message from content');
        if (message.popupBody != 'none') {
          //alert('background received non-null popupBody');
          //alert(message.popupBody);
          var views = chrome.extension.getViews({ type: 'popup' });
          for (var i in views) {
            views[i].document.body.innerHTML = message.popupBody;
          }
        } else {
          //alert('no message.popupBody!');
        }
        break;

      case 'popup savestories':
        //alert('message from popup');
        if (message.tabId) sendBackground(message.tabId);
        break;
      default:
    }
}

chrome.runtime.onMessage.addListener(backgroundListen);
