window.onload = function() {
  //alert('popup is loaded!');
  //downloadToBackground("https://story0.userapi.com/c839116/v839116218/982e/LFw9w2lh1WU.jpg,https://story0.userapi.com/c621514/v621514483/b111/UyzJsZM9Q_c.jpg,");
  chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
    chrome.runtime.sendMessage({from:'popup savestories',tabId:tabArray[0].id});
});
}

/*
function downloadToBackground(text){
  alert('download to background');
  chrome.runtime.sendMessage({from:'popup savestories', download:text});
}
*/
