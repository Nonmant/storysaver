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
function addButton(tab) {
  chrome.tabs.executeScript({file: 'add.js'});
};

chrome.tabs.onUpdated.addListener(addButton);
chrome.pageAction.onClicked.addListener(loadAnon);
function loadAnon(tab){
  chrome.pageAction.setIcon({tabId:tab.id, path:'48active.png'});
  chrome.tabs.executeScript({file: "anon.js"});
  chrome.pageAction.setTitle({tabId:tab.id, title:'Анонимное сохранение активно. Откройте любую историю.'});
}
