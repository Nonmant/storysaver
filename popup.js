window.onload = function() {
  //alert('popup is loaded!');
  let noStorage=true;
  if(chrome.storage){
    if(chrome.storage.sync){
      noStorage=false;
      chrome.storage.sync.get({customSizeStyleText : '', customDelayText : ''},
      function(items){
        document.getElementById('customSizeStyle').textContent=items.customSizeStyleText;
        document.getElementById('customDelayStyle').textContent=items.customDelayText;
      });
    }
    else if (chrome.storage.local) {
      noStorage=false;
      function onGot(item){
        if(item.customSizeStyleText){
          document.getElementById('customSizeStyle').textContent=item.customSizeStyleText;
        }
        if(item.customDelayText){
          document.getElementById('customDelayStyle').textContent=item.customDelayText;
        }
      };
      let getting=chrome.storage.local.get(['customSizeStyleText', 'customDelayText']);
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
  chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    chrome.runtime.sendMessage({from:'popup savestories',tabId:tabArray[0].id});
});
};

function downloadPopup(text){
  var downloadArray=text.split(',');
  for(var i in downloadArray){
    if(downloadArray[i]&&(downloadArray[i].indexOf('.jpg')!=-1||downloadArray[i].indexOf('.mp4')!=-1))chrome.downloads.download({url: downloadArray[i]});
  }
}
function onPopupClick(e){
  var target=e.target;
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
  chrome.runtime.openOptionsPage();
}
