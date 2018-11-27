window.onload = function() {
  //alert('popup is loaded!');
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
    target=target.parentElement;
  }
  downloadPopup(target.id);
}
document.onclick = onPopupClick;
