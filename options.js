slideShowTimer='', customSizeStyleTextG='',customSizeStyleValueG='', customDelayTextG='', customDelayValueG=true;

if(chrome.storage){
  if(chrome.storage.sync){
    getCustomDelay=function functionName() {
      chrome.storage.sync.get({customDelayText : '', customDelayValue: true},
      function(items){
        customDelayTextG=items.customDelayText;
        customDelayValueG=items.customDelayValue;
        document.getElementById('delayCheckbox').checked=customDelayValueG;
        setCustomDelay();
      });
    };

    saveCustomDelay=function() {
      chrome.storage.sync.set({customDelayText : customDelayTextG, customDelayValue: customDelayValueG});
    };

    getCustomSizeStyle=function(){
      chrome.storage.sync.get({customSizeStyleText : '', customSizeStyleValue: '0.1'},
      function(items){
        customSizeStyleTextG=items.customSizeStyleText;
        customSizeStyleValueG=items.customSizeStyleValue;
        document.getElementById('prevSizeRange').value=customSizeStyleValueG;
        setCustomSizeStyle();
      });
    };

    saveCustomSizeStyle=function() {
      chrome.storage.sync.set({customSizeStyleText : customSizeStyleTextG, customSizeStyleValue: customSizeStyleValueG});
    };
  }
  else if (chrome.storage.local) {

    getCustomDelay=function(){
      function onGot(item){
        if(item.customDelayText){
          customDelayTextG=item.customDelayText;
        }
        if(item.customDelayValue){
          customDelayValueG=item.customDelayValue;
          document.getElementById('delayCheckbox').checked=customDelayValueG;
        }
        setCustomDelay();
      };
      let getting=chrome.storage.local.get(['customDelayText', 'customDelayValue']);
      getting.then(onGot,null);
    };
    saveCustomDelay=function() {
      chrome.storage.local.set({customDelayText : customDelayTextG, customDelayValue: customDelayValueG});
    };


    getCustomSizeStyle=function(){
      function onGot(item){
        if(item.customSizeStyleText){
          customSizeStyleTextG=item.customSizeStyleText;
        }
        if(item.customSizeStyleValue){
          customSizeStyleValueG=item.customSizeStyleValue;
          document.getElementById('prevSizeRange').value=customSizeStyleValueG;
        }
        setCustomSizeStyle();
      };
      let getting=chrome.storage.local.get(['customSizeStyleText', 'customSizeStyleValue']);
      getting.then(onGot,null);
    };
    saveCustomSizeStyle=function() {
      chrome.storage.local.set({customSizeStyleText : customSizeStyleTextG, customSizeStyleValue: customSizeStyleValueG});
    };
  }
}

if(!('getCustomSizeStyle' in window)){
  myStorage = window.localStorage;

  getCustomDelay=function(){
    if(myStorage.customDelayText){
      customDelayTextG=myStorage.customDelayText;
    }
    if(myStorage.customDelayValue){
      customDelayValueG=myStorage.customDelayValue;
      document.getElementById('delayCheckbox').checked=customDelayValueG;
    }
    setCustomDelay();
  };
  saveCustomDelay=function() {
    myStorage.customDelayText=customDelayTextG;
    myStorage.customDelayValue=customDelayValueG;
  };

  getCustomSizeStyle=function(){
    if(myStorage.customSizeStyleText){
      customSizeStyleTextG=myStorage.customSizeStyleText;
    }
    if(myStorage.customSizeStyleValue){
      customSizeStyleValueG=myStorage.customSizeStyleValue;
      document.getElementById('prevSizeRange').value=customSizeStyleValueG;
    }
    setCustomSizeStyle();
  };
  saveCustomSizeStyle=function() {
    myStorage.customSizeStyleText=customSizeStyleTextG;
    myStorage.customSizeStyleValue=customSizeStyleValueG;
  };
}

var setCustomSizeStyle=function() {
  customStyle=document.getElementById('exampleFrame').contentDocument.getElementById('customSizeStyle');
  customStyle.textContent=customSizeStyleTextG;
  updateExampleSizes();
}

var setCustomDelay=function() {
  customDelay=document.getElementById('exampleFrame').contentDocument.getElementById('customDelayStyle');
  customDelay.textContent=customDelayTextG;
}

var updateExampleSizes = function(){
  let iframe=document.getElementById('exampleFrame');
  if(!iframe)return;
  iframeHtml=iframe.contentDocument.getElementsByTagName('html')[0];
  if(!iframeHtml)return;
  iframe.width=iframeHtml.offsetWidth;
  iframe.height=iframeHtml.offsetHeight;
  iframe.style.width=iframe.width;
  iframe.style.height=iframe.height;
}

var onPrevSizeChanged = function(){
  customSizeStyleValueG=document.getElementById('prevSizeRange').value;
  let width=Math.ceil(604*customSizeStyleValueG), height=Math.ceil(1080*customSizeStyleValueG);
  customSizeStyleTextG=".story:hover span, .story.hover span{width:"+width+"px !important;height:"+height+"px !important;} body{min-width:"+width+"px !important;min-height:"+height+"px !important;}";
  setCustomSizeStyle();
}

var onDelayChanged = function() {
  customDelayValueG=document.getElementById('delayCheckbox').checked;
  customDelayTextG=customDelayValueG?'':'.story span{transition:0s !important;}';
  setCustomDelay();
}

var startSlideShow=function(){
  slideShowTimer=setInterval(slideShow,2500);
  setTimeout(function(){
    document.getElementById('prevSizeRange').parentElement.title='';
    document.getElementById('delayCheckbox').parentElement.title='';
  },5000);
}

var customStyleMouseOut=function() {
  //let value=document.getElementById('prevSizeRange').value;
  //let text=document.getElementById('exampleFrame').contentDocument.getElementById('customSizeStyle').textContent;
  saveCustomSizeStyle();
  stopSlideShow();
}

var customDelayMouseOut=function() {
  saveCustomDelay();
  stopSlideShow();
}

var stopSlideShow=function(){
  clearInterval(slideShowTimer);
  document.getElementById('prevSizeRange').parentElement.title='Подождите начала предпросмотра';
  document.getElementById('delayCheckbox').parentElement.title='Подождите начала предпросмотра';
}

var slideShow = function(){
  exampleDoc=document.getElementById('exampleFrame').contentDocument;
  storiesList=exampleDoc.getElementsByClassName('story');
  story = storiesList[Math.floor(Math.random() * storiesList.length)];
  story.classList.add('hover');
  setTimeout(function(storyIn){storyIn.classList.remove('hover');}, 2000, story);
}

var onLoad = function(){
  //https://stackoverflow.com/a/17707328
  let ifr=document.getElementById("exampleFrame");
  let docIfr=ifr.contentWindow.document;
  docIfr.open('text/html', 'replace');
  docIfr.write(ifr.getAttribute("srcdoc"));
  docIfr.close();
  //updateExampleSizes();
  getCustomSizeStyle();
  range=document.getElementById('prevSizeRange');
  if(customSizeStyleValueG){
  range.value=customSizeStyleValueG;
  }
  else{
  range.value=range.min;
  }
  range.addEventListener('input',onPrevSizeChanged);
  range.parentElement.addEventListener('mouseover',startSlideShow);
  range.parentElement.addEventListener('mouseout',customStyleMouseOut);

  getCustomDelay();
  checkbox=document.getElementById('delayCheckbox');
  checkbox.checked=customDelayValueG;
  checkbox.addEventListener('change', onDelayChanged);
  checkbox.parentElement.addEventListener('mouseover',startSlideShow);
  checkbox.parentElement.addEventListener('mouseout',customDelayMouseOut);
}
//window.addEventListener('readystatechange',updateExampleSizes);
//window.addEventListener('onload',updateExampleSizes);
window.addEventListener('load',onLoad);
//.classList.add('hover')
//.classList.remove('hover')
