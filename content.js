var makeBody=function(){
  //alert('document: script run');
  var stories=[], count=0;

  for(var i in cur){
    if(Object.keys(cur)[count].indexOf("stories_list")!=-1){
      stories.push.apply(stories,cur[i]);
    }
    ++count;
  }

  if(stories.length){
    var popupBody=document.createElement('body');
    var settings=document.createElement('div');
    settings.className='settings';
    settings.title='Настройки';
    popupBody.appendChild(settings);
    for(var i in stories){
      var story=stories[i];
      var aPerson=document.createElement('button');
      aPerson.id='';
      var dPerson=document.createElement('div');
      aPerson.title='Сохранить все истории пользователя';

      var aPersonImage=story.author.photo.indexOf('http')!=-1?story.author.photo:'https://vk.com/images/icons/msg_error.png';
      aPerson.setAttribute('style', 'background-image: url(' + aPersonImage + ');');

      var pPerson=document.createElement('span');
      pPerson.innerText=story.author.name.split(' ')[0];
      aPerson.appendChild(pPerson);
      dPerson.appendChild(document.createElement('hr'));

      for(var j in story.items){
        var item=story.items[j];
        var aItem=document.createElement('button');
        var sItem=document.createElement('span');
          if(item.type==`photo`){
            aItem.id=item.photo_url;
            sItem.className='photo';
            sItem.setAttribute('style', 'background-image:url('+item.photo_url+');');
          }
          else {
            aItem.id=item.video_url;
            sItem.className='video';
            sItem.setAttribute('style', 'background-image:url('+item.first_frame+');');
          }
        aPerson.id+=aItem.id+',';
        aItem.className='story';
        aItem.setAttribute('style', 'background-image: url(' + item.preview_url + ');');
        aItem.appendChild(sItem);
        dPerson.appendChild(aItem);
      }
      dPerson.insertBefore(aPerson, dPerson.firstChild);
      popupBody.appendChild(dPerson);
      popupBody.appendChild(document.createElement('p'));
    }
    var aHome=document.createElement('a');
    aHome.href='https://vk.com/savestories';
    aHome.innerText='О\u00a0расширении';
    aHome.target='_blank';
    popupBody.appendChild(aHome);
    window.postMessage({from:'document savestories', popupBody:popupBody.innerHTML}, '*');
  }
  else {
    window.postMessage({from:'document savestories', popupBody:'none'}, '*');
  }
  document.head.removeChild(document.getElementById('savestories'));
};


function contentListen(request, sender){
  //alert('received message in content listener');
  if(request.from=='background savestories'){
    //alert('content listener: from background');
    //sendResponse({"name":"Петя"});
    if(request.download){
      if(request.download.filename){
      downloadContent(request.download.url, request.download.filename);
    }
    else {
      downloadContent(request.download.url);
    }
      return;
    }
    var script=document.createElement('script');
    script.type='text/javascript';
    script.async=true;
    script.text=String(makeBody).slice(12, -1);
    script.id='savestories';
    document.head.appendChild(script);
  }
}

chrome.runtime.onMessage.addListener(contentListen);

window.addEventListener("message", function(event) {
  if (event.source == window) {
    //alert('received message in content event listener');
    if(event.data.from=='document savestories'){
      //alert("content event listener: from document");
      chrome.runtime.sendMessage({from:'content savestories', popupBody:event.data.popupBody, links:event.data.links});
    }
  }
});

function downloadContent(url, filename=""){
  let link=document.createElement('a');
  link.href = url;
  if(filename==""){
    filename=url.substr(url.lastIndexOf('/') + 1);
  }
  link.download = filename;
  link.click();
}
