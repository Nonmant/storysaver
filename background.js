// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {


  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'vk.com' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'vk.com' },
          })
        ],
        // And shows the extension's page action.
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
    /*else if(message.download){
      var downloadArray=message.download.split(',');
      for(var i in downloadArray){
        if(downloadArray[i])chrome.downloads.download({url: downloadArray[i]});
      }
    }*/
    break;

    default:
  }
}
chrome.runtime.onMessage.addListener(backgroundListen);
