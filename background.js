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
  console.log('[storysaver]:',"sendBackground sending to tab "+tabId);
  //chrome.tabs.sendMessage(tab.id, {from:'background savestories'}, function(response) {alert(response.name);});
  chrome.tabs.sendMessage(tabId, { from: 'background savestories' });
}

function backgroundListen(message) {
  console.log('[storysaver]:','background listener');
  if (message.from)
    switch (message.from) {
      case 'content savestories':
        console.log('[storysaver]:','message from content');
        if (message.popupBody != 'none') {
          console.log('[storysaver]:','background received non-null popupBody');
          //alert(message.popupBody);
          var views = chrome.extension.getViews({ type: 'popup' });
          for (var i in views) {
            views[i].document.body.innerHTML = message.popupBody;
          }
        } else {
          console.log('[storysaver]:','no message.popupBody!');
        }
        break;

      case 'popup savestories':
        console.log('[storysaver]:','message from popup');
        if (message.tabId) sendBackground(message.tabId);
        break;
      default:
    }
}

chrome.runtime.onMessage.addListener(backgroundListen);
