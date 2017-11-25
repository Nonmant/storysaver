var makeBody=function(){
  //alert('document: script run');
  var stories=cur.stories_list_feed;
  if(!stories)stories=cur.stories_list_profile;
  if(stories){
    var popupBody=document.createElement('body');
    for(var i in stories){
      var story=stories[i];
      var aPerson=document.createElement('a');
      var dPerson=document.createElement('div');
      //aPerson.title='Сохранить все истории пользователя';
      //aPerson.href='#';
      //aPerson.setAttribute('onclick','alert(`aPerson clicked`);downloadToBackground(`');
      var iPerson=document.createElement('img');
      if(story.author.photo.indexOf('http')==-1)iPerson.src='https://vk.com/images/icons/msg_error.png';
      else iPerson.src=story.author.photo;
      aPerson.appendChild(iPerson);
      var pPerson=document.createElement('span');
      pPerson.innerText=story.author.name.split(' ')[0];
      aPerson.appendChild(pPerson);
      //popupBody.appendChild(aPerson);
      dPerson.appendChild(document.createElement('hr'));
      //popupBody.appendChild(document.createElement('hr'));

      for(var j in story.items){
        var item=story.items[j];
        var aItem=document.createElement('a');
        aItem.title='Сохранить историю';
        aItem.href=(item.type==`photo`)?item.photo_url:item.video_url;
        //aItem.setAttribute('onclick','downloadToBackground(`'+aItem.href+'`)');
        //aPerson.setAttribute('onclick', aPerson.getAttribute('onclick') +aItem.href+',');
        aItem.download=true;
        var iItem=document.createElement('img');
        iItem.src=item.preview_url;
        aItem.appendChild(iItem);
        //popupBody.appendChild(aItem);
        dPerson.appendChild(aItem);
      }
      //aPerson.setAttribute('onclick', aPerson.getAttribute('onclick')+'`);');
      dPerson.insertBefore(aPerson, dPerson.firstChild);
      popupBody.appendChild(dPerson);
      popupBody.appendChild(document.createElement('p'));
    }
    window.postMessage({from:'document savestories', popupBody:popupBody.innerHTML}, '*');
  }
  else {
    window.postMessage({from:'document savestories', popupBody:'none'}, '*');
  }
  //document.body.setAttribute('onclick','');
  document.head.removeChild(document.getElementById('savestories'));
};


function contentListen(request, sender){
  //alert('received message in content listener');
  if(request.from=='background savestories'){
    //alert('content listener: from background');
    //sendResponse({"name":"Петя"});
    var script=document.createElement('script');
    script.type='text/javascript';
    script.async=true;
    script.text=String(makeBody).slice(12, -1);
    script.id='savestories';
    document.head.appendChild(script);
/*document.body.setAttribute("onclick", String(makeBody).slice(12, -1));
var event = new MouseEvent('click');
document.body.dispatchEvent(event);*/
  }
}

chrome.runtime.onMessage.addListener(contentListen);

window.addEventListener("message", function(event) {
  if (event.source == window) {
    //alert('received message in content event listener');
    if(event.data.from=='document savestories'){
      //alert("content event listener: from document");
      chrome.runtime.sendMessage({from:'content savestories', popupBody:event.data.popupBody});
    }
  }
});
