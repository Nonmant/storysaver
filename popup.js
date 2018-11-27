window.onload = function() {
  //alert('popup is loaded!');
  let noStorage=true;
  if(browser.storage){
    if(browser.storage.sync){
      noStorage=false;
      browser.storage.sync.get({customSizeStyleText : '', customDelayText : ''},
      function(items){
        document.getElementById('customSizeStyle').textContent=items.customSizeStyleText;
        document.getElementById('customDelayStyle').textContent=items.customDelayText;
      });
    }
    else if (browser.storage.local) {
      noStorage=false;
      function onGot(item){
        if(item.customSizeStyleText){
          document.getElementById('customSizeStyle').textContent=item.customSizeStyleText;
        }
        if(item.customDelayText){
          document.getElementById('customDelayStyle').textContent=item.customDelayText;
        }
      };
      let getting=browser.storage.local.get(['customSizeStyleText', 'customDelayText']);
      getting.then(onGot, null);
    }
  }
  if(noStorage){
    let myStorage = window.localStorage;
    if(myStorage.customSizeStyleText){
      document.getElementById('customSizeStyle').textContent=myStorage.customSizeStyleText;
    }
    if(myStorage.customDelayText){
      document.getElementById('customDelayStyle').textContent=myStorage.customDelayText;
    }
  }
  //
  browser.tabs.query({active:true,currentWindow:true},function(tabArray){
    browser.runtime.sendMessage({from:'popup savestories',tabId:tabArray[0].id});
});
};

function downloadPopup(text){
  var downloadArray = text.split(',');
  var tabId;
  browser.tabs.query({active:true,currentWindow:true},function(tabArray){
    for (var i in downloadArray) {
      if (downloadArray[i] && (downloadArray[i].indexOf('.jpg') != -1 || downloadArray[i].indexOf('.mp4') != -1)) {
        browser.runtime.sendMessage(
          {
            from:'popup savestories',
            tabId:tabArray[0].id,
            download:{
              url:downloadArray[i],
              filename:'savestories'+downloadArray[i].substr(downloadArray[i].lastIndexOf('/') + 1)
            }
          }
        );

      }
    }
  });
}
function onPopupClick(e){
    var target = e.target;
    if (target == null) {
        return;
    }
  while ((!target.id)&&(target!=document.body)) {
    if(target.className=='settings'){
      openSettings();
    }
    target=target.parentElement;
  }
  downloadPopup(target.id);
}
document.onclick = onPopupClick;
function openSettings() {
  browser.runtime.openOptionsPage();
}
//API bridge for edge
browser.runtime.openOptionsPage = function (callback) {
    var optionsPageUrl = myBrowser.runtime.getManifest()["options_page"];
    //var optionsPageUrl = myBrowser.runtime.getURL(optionsPage);
    if (typeof callback !== "undefined") {
        myBrowser.tabs.create({ url: optionsPageUrl }, callback);
    }
    else {
        myBrowser.tabs.create({ url: optionsPageUrl });
    }
};
