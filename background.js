chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'vk.com' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
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

      //safeResponse begin
      var parser = new DOMParser;
      var tmpDom = parser.parseFromString(message.popupBody, "text/html").body;
      //getting rid of unsafe nodes
      var list = tmpDom.querySelectorAll("script,img");

      for (var i = list.length - 1; i >= 0; i--) {
        list[i].remove();
      }
      //leaving just safe attributes
      list = tmpDom.getElementsByTagName("*");
      var validAttrs = [ "class", "id", "style" ];

      for (var i = list.length - 1; i >= 0; i--) {
        target=list[i];

        var attrs = target.attributes, currentAttr;

        for (var i = attrs.length - 1; i >= 0; i--) {
          currentAttr = attrs[i].name;

          if (attrs[i].specified && validAttrs.indexOf(currentAttr) === -1) {
            target.removeAttribute(currentAttr);
          }
        }
      }
      //safeResponse end
      for (var i in views) {
        //views[i].document.body.innerHTML = message.popupBody;
        views[i].document.body=tmpDom;
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
