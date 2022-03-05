var AniaChat_SendSmsTo=[];
var AniaChat_SendSms=false;
var AniaChat_forceRegister=false;
var AniaChat_registerItems=[];
var absoluteUrl=""
window.AniaChatInit = function(ioParam,urlParam){
    let  socket = ioParam(urlParam);
    debugger;
    socket.on("setChat", (data) => {
        debugger;
        getChat()
    });
    var url=`${urlParam}ChatApi/chatSettings`;
    var callback = function(response){
        create(response);    
    }
    var error = function(err){
    }
    absoluteUrl=urlParam;    
    server(url,{AniaChatId:window.AniaChatId,User:1,get:1},callback,error);
    

}
window.AniaChatSendBtn = function(box,content){
    document.getElementById("ania-chat-attachBtn").style.display="block";
    document.getElementById("ania-chat-sendBtn").style.display="none";
    setChat();
}
window.AniaChatClickBox = function(box,content){
    if(content.className.indexOf("ania-chat-content-show") == -1){
        getChat();
    }
    content.classList.toggle("ania-chat-content-show");

    

    
}
function create(resp){
    let settings = (resp.result && resp.result[0])||{};
    AniaChat_SendSms = settings.SendSms;
    AniaChat_SendSmsTo = settings.SendSmsTo;
    AniaChat_forceRegister = settings.forceRegister;
    AniaChat_registerItems = settings.RegisterItem;
    let info = (resp.info && resp.info[0])||{};
    let helpers=[];
    let helpersHtml="";
    let count=0;
    let url = absoluteUrl;
    //let url = 'http://localhost:3000/';

    let profilesWidth=40;
    if(info.userInfo && info.userInfo){
        for(var i=0;i<info.userInfo.length;i++){
            if(info.userInfo[i].map=="کارمند-پشتیبان"){
                let profile = info.userInfo[i].profile ? url+info.userInfo[i].profile.replace(/\\/gi, "/").split("public")[1] : 'https://siteapi.sarvapps.ir/user.png'
                helpers.push(info.userInfo[i]);
                let right = count*25-8;
                count++;
                profilesWidth+=25;
                helpersHtml+="<div style='height:50px;background-size:contain;width:50px;border-radius:25px;background-repeat: no-repeat;background-image: url("+profile+");position:absolute;top:5px;right:"+right+"px' ></div>"
            }
                
        }

    }

    var parentOfImg = document.createElement("div");
    var position = settings.placeFilter||"bottom-right";

    parentOfImg.className = "ania-chat-box "+position+"";
    parentOfImg.id = "ania-chat-box";
    var img = document.createElement("img");
    img.src= settings.picFilter ||"https://sarvapps.ir/help.png";
    let picEffect= settings.picEffect ||"";

    
    img.id = "ania-chat-logo";
    img.className="ania-chat-logo "+picEffect;
    var body = document.createElement("div");
    var content = document.createElement("div");
    content.className = "ania-chat-content "+position+"";
    content.id= "ania-chat-content";
    var textArea = document.createElement("textarea");    
    textArea.placeholder=settings.placeHolder || "پیام خود را بنویسید";
    textArea.id = "ania-chat-text";
    textArea.onkeypress=function(){
        var key = window.event.keyCode;
        // If the user has pressed enter
        if (key === 13) {
            setChat();
            return false;
        }
        else {
            return true;
        }
    }
    textArea.onkeyup=function(){
        var key = window.event.keyCode;
        if(window.event.currentTarget.value){
            document.getElementById("ania-chat-attachBtn").style.display="none";
            document.getElementById("ania-chat-sendBtn").style.display="block";
        }else{
            document.getElementById("ania-chat-attachBtn").style.display="block";
            document.getElementById("ania-chat-sendBtn").style.display="none";


        }
       
    }
    var headerBox = document.createElement("div");
    headerBox.className = "ania-chat-header";
    let topText = settings.topText || 'سوالی دارید ؟ \n با ما صحبت کنید ...';
    headerBox.innerHTML="<div style='display:flex;position:relative'>"+helpersHtml+"</div><div style='display:flex;justify-content: space-between;width:calc(100% - "+profilesWidth+"px)'><div><div style='color:#fff;font-size:14px;white-space:pre-wrap'>"+topText+"</div></div><div><img src='https://sarvapps.ir/close_icon.png' style='width:20px;cursor:pointer' id='ania-chat-close'  /></div></div>";
    var centerBox = document.createElement("div");
    centerBox.className = "ania-chat-center";
    centerBox.id = "ania-chat-center";
    centerBox.innerHTML="";
    var footerBox = document.createElement("div");
    footerBox.className = "ania-chat-footer";
    var btnBox = document.createElement("div");
    btnBox.style.display="flex";
    btnBox.style.justifyContent="space-between";
    btnBox.style.width="68px";
    var emojiBox = document.createElement("div");
    emojiBox.className="ania-chat-emoji";
    emojiBox.style.display="none";
    emojiBox.innerHTML="<span>😁</span><span>😃</span><span>😅</span><span>😆</span><span >😇</span><span>😉</span><span>😂</span><span>🙂</span><span  >🙃</span><span  >🤣</span><span>😊</span><span>😍</span><span>😘</span><span>😋</span><span>😜</span><span  >🤑</span><span  >🤗</span><span  >🤔</span><span>😐</span><span>😏</span><span  >🙄</span><span>😔</span><span>😴</span><span>😪</span><span  >🤒</span><span  >🤕</span><span  >🤢</span><span>😎</span><span  >😕</span><span  >🙁</span><span>😲</span><span>😢</span><span>😭</span><span>😱</span><span>😖</span><span>😓</span><span>😡</span><span>😤</span><span  >🖐</span><span>👌</span><span>👆</span><span>👇</span><span>👍</span><span>👎</span><span>✋</span><span  >🤝</span><span>🙏</span><span>👋</span><span>👏</span><span>💬</span><span>💔</span><span>💜</span><span>💖</span><span>👓</span><span>🎀</span><span>👶</span><span>👦</span><span>👧</span><span>🌎</span><span>👪</span><span>💎</span><span>💥</span><span>🚦</span><span>🚀</span><span>🕓</span><span>⚡</span><span>🎁</span><span>🎵</span><span>📕</span><span>📅</span><span>🐱</span><span>🏠</span><span>🎫</span><span>📞</span><span>💳</span><span>🔒</span><span>🌹</span>"
    emojiBox.id= "ania-chat-emojiBox";

    var sendBtn = document.createElement("button");
    sendBtn.id= "ania-chat-sendBtn";
    sendBtn.style.backgroundColor="transparent";
    
    sendBtn.innerHTML="<img src='https://sarvapps.ir/send.png' style='width:25px;transform:rotate(180deg)' />";
    sendBtn.style.display = "none"

    var emojiBtn = document.createElement("button");
    emojiBtn.style.backgroundColor="transparent";
    emojiBtn.innerHTML="<img src='https://sarvapps.ir/emoji.png' style='width:25px' />";
    emojiBtn.id= "ania-chat-emojiBtn";

    var attachBtn = document.createElement("button");
    attachBtn.style.backgroundColor="transparent";
    attachBtn.innerHTML="<img src='https://sarvapps.ir/attach.png' style='width:25px' />";
    attachBtn.id= "ania-chat-attachBtn";
    var attachfileUpload = document.createElement("input");
    attachfileUpload.type="file";
    attachfileUpload.style.display="none";
    attachfileUpload.id="ania-chat-attachfileUpload";

    btnBox.appendChild(emojiBtn)

    btnBox.appendChild(sendBtn)
    btnBox.appendChild(attachBtn)
    btnBox.appendChild(attachfileUpload)

    footerBox.appendChild(emojiBox)

    footerBox.appendChild(textArea)
    footerBox.appendChild(btnBox)
    var registerBtn = document.createElement("button");
    var ania_chat_user_id = getCookie("ania_chat_user_id");

    if(AniaChat_forceRegister && !ania_chat_user_id){
        var registerBox = document.createElement("div");
        registerBox.className = "ania-chat-reg-box";
        registerBox.id = "ania-chat-reg-box";

        var registerItems="<div><span style='color:orange;margin-top:30px'>برای ادامه گفتگو لطفا اطلاعات زیر را ثبت کنید</span></div>";
        for(var i=0;i<AniaChat_registerItems.length;i++){
            var name = AniaChat_registerItems[i];
            var label = name == "name" ? "نام و نام خانوادگی" : (name == "mail" ? "پست الکترونیکی" : "تلفن همراه");
            registerItems += "<div style='margin-top:30px'><label>"+label+"</label><input type='text' autocomplete='false' name='"+AniaChat_registerItems[i]+"' id='"+AniaChat_registerItems[i]+"' /></div>";
        }
        registerBtn.innerText="ثبت نام"
        registerBox.innerHTML = registerItems;
        registerBox.appendChild(registerBtn)
        content.appendChild(registerBox);


    }
    content.appendChild(headerBox);
    content.appendChild(centerBox);

    content.appendChild(footerBox);

    parentOfImg.appendChild(img);
    body.appendChild(parentOfImg)

    
    body.appendChild(content);

   




    
    attachfileUpload.addEventListener("change",function(event){
        var formData = new FormData();
        formData.append('name', event.target.files[0]?.name);
        formData.append('ExtraFile', "1");
        formData.append('typeOfFile', "2");
        if(!event.target.files[0]){
          return;
    
        }
        formData.append('myImage', event.target.files[0]);
        var callback = function(response){
            //let file = "http://localhost:3000/" + response.split("public")[1];
            let file = absoluteUrl + response.split("public")[1];

            if(file.indexOf(".png") > 0 ||  file.indexOf(".jpg") > 0 ||  file.indexOf(".gif") > 0){
                document.getElementById("ania-chat-text").value = '<img src='+file+'  />'
                setChat();

            }else{
                document.getElementById("ania-chat-text").value = '<a href='+file+' target="_blank" >فایل ارسالی</a>'
                setChat();


            }
           
        }
        var error = function(err){
    
        }


        var url=`${absoluteUrl}ChatApi/uploadFile`;

        
        fileUpload(url,formData,callback,error);

        return false;

    })
    registerBtn.addEventListener("click",function(event){
        var inputs = document.getElementById("ania-chat-reg-box").getElementsByTagName("input");
        var param={};
        for(let i=0;i<inputs.length;i++){
            param[inputs[i].name]=inputs[i].value;
        }
        var ania_chat_id = getCookie("ania_chat_id");
        param.code = window.AniaChatId;
        debugger;
        var url=`${absoluteUrl}ChatApi/setChat`;

        var callback = function(response){
            document.cookie = "ania_chat_user_id="+response.insertedId+"";
            registerBox.style.display = "none";
        }
        var error = function(err){

        }
        server(url,param,callback,error);
        return false;

        })



    attachBtn.addEventListener("click",function(event){
        document.getElementById("ania-chat-attachfileUpload").click();
    })


    emojiBox.addEventListener("click",function(event){
        var Editor = document.getElementById("ania-chat-text");
        var cursorPosition = Editor.selectionStart
        var textBeforeCursorPosition = Editor.value.substring(0, cursorPosition)
        var textAfterCursorPosition = Editor.value.substring(cursorPosition, Editor.value.length)
        Editor.value = textBeforeCursorPosition + event.target.innerText + textAfterCursorPosition;
        document.getElementById("ania-chat-attachBtn").style.display="none";
        document.getElementById("ania-chat-sendBtn").style.display="block";
    })
    


    emojiBtn.addEventListener("click",function(){
      if(document.getElementById("ania-chat-emojiBox").style.display == "none")  
        document.getElementById("ania-chat-emojiBox").style.display="flex"
      else
        document.getElementById("ania-chat-emojiBox").style.display="none"  
    })
    sendBtn.addEventListener("click",function(){
      window.AniaChatSendBtn()
    })
    document.getElementsByTagName("body")[0].appendChild(body);

    var close = document.getElementById("ania-chat-close");
    
    close.addEventListener("click",function(){
        window.AniaChatClickBox(parentOfImg,content)
    })
    parentOfImg.addEventListener("click",function(){
      window.AniaChatClickBox(parentOfImg,content)
    })
}
function textAreaChange() {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
        setChat();
        return false;
    }
    else {
        return true;
    }
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function getChat(){
    var ania_chat_id = getCookie("ania_chat_id");

    //var url='http://localhost:3000/ChatApi/getChat';
    var url=`${absoluteUrl}ChatApi/getChat`;

    
    var centerBox = document.getElementById("ania-chat-center");

    var callback = function(response){
        response = response.result
        if(response[0]){
            var resp = response[0];
            var details="";
            if(resp.End){
                document.cookie = "ania_chat_id=";
                centerBox.innerHTML="";
            }else{

                for(var i=0;i<resp.chats_detail.length;i++){
                    var color = resp.chats_detail[i].userSend ? '#c2ff94ba' : '#fff';
                    var span = document.createElement('span');
                    span.innerHTML = resp.chats_detail[i].text
                    span = span.innerHTML;
                    if(resp.chats_detail[i].userSend){
                        var icon = resp.chats_detail[i].read ? "<img src='https://sarvapps.ir/read.png' style='width:16px' />" :  "<img src='https://sarvapps.ir/unread.png' style='width:16px;opacity:0.3' />"
                        details+="<p style='float:right;clear:both;white-space:pre-wrap;background:"+color+";margin-top:5px !important;border-radius:10px;padding:8px;color:#000;font-size:13px;max-width:100%;overflow:hidden'><span>"+span+"</span><br/><sapn>"+icon+"</span><sapn style='font-size:10px;color:#b9b9b9;padding-right:3px'>"+resp.chats_detail[i].TodayTime+"</span></p>"

                    }
                    else
                        details+="<p style='float:left;clear:both;white-space:pre-wrap;background:"+color+";text-align:left;margin-top:5px !important;border-radius:10px;padding:8px;color:#000;font-size:13px'><span>"+span+"</span><br/><sapn style='font-size:10px;color:#b9b9b9'>"+resp.chats_detail[i].TodayTime+"</span></p>"
        
                }
                var span = document.createElement('span');
                span.innerHTML = resp.text
                span = span.innerHTML;
                var icon = resp.read ? "<img src='https://sarvapps.ir/read.png' style='width:16px' />" :  "<img src='https://sarvapps.ir/unread.png' style='width:16px;opacity:0.3' />"

                centerBox.innerHTML = "<p style='float:right;clear:both;white-space:pre-wrap;background:#c2ff94ba;border-radius:10px;padding:8px;color:#000;font-size:13px;max-width:100%;overflow:hidden'><span>"+span+"</span><br/><sapn>"+icon+"</span><sapn style='font-size:10px;color:#b9b9b9;padding-right:3px'>"+resp.TodayTime+"</span></p>"+details;
                centerBox.scrollTop = centerBox.scrollHeight;
            }
            
        }
        
    }
    var error = function(err){

    }
    if(ania_chat_id){
        server(url,{_id:ania_chat_id,code:window.AniaChatId,User:1},callback,error);

    }

  }
  function setChat(){
    var value = document.getElementById("ania-chat-text").value;
    if(!value)
        return;
    document.getElementById("ania-chat-emojiBox").style.display="none"  
    
    document.getElementById("ania-chat-text").value = "";
    var ania_chat_id = getCookie("ania_chat_id");
    var ania_chat_user_id = getCookie("ania_chat_user_id");

    //var url='http://localhost:3000/ChatApi/setChat';
    var url=`${absoluteUrl}ChatApi/setChat`;

    var callback = function(response){
        response = response.result;
        if(!ania_chat_id){
            ania_chat_id = response.ops[0]._id;
            document.cookie = "ania_chat_id="+ania_chat_id+"";
        }
        getChat();
    }
    var error = function(err){

    }
    let browser = {};
    if(!ania_chat_id){
        browser.name = detectBrowser();
        browser.platform = navigator.platform;
    }
    server(url,{_id:ania_chat_id ? ania_chat_id : null,UId:ania_chat_user_id ? ania_chat_user_id : null,value:value,userSend:1,code:window.AniaChatId,SendSmsTo: AniaChat_SendSms ? AniaChat_SendSmsTo : [],browser:browser},callback,error);
  }
  function server(url,param,callback,error){

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin","*");
    xhr.setRequestHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS");
    xhr.setRequestHeader("Access-Control-Allow-Headers","x-requested-with, Content-Type, origin, authorization, accept, client-security-token");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            try{
                var resp = JSON.parse(this.response);
                callback(resp)
            }
            catch(error){

            }
        }
    }
    xhr.send(JSON.stringify(param));
  }

  function fileUpload(url,param,callback,error){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Access-Control-Allow-Origin","*");
    xhr.setRequestHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS");
    xhr.setRequestHeader("Access-Control-Allow-Headers","x-requested-with, Content-Type, origin, authorization, accept, client-security-token");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            try{
                var resp = this.response;
                callback(resp)
            }
            catch(error){

            }
        }
    }
    xhr.send(param);
  }
  function detectBrowser() { 
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return 'Opera';
    } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
        return 'Chrome';
    } else if(navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari';
    } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
        return 'Firefox';
    } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return 'IE';//crap
    } else {
        return 'Unknown';
    }
} 

  