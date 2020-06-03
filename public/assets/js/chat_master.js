const socket=io.connect("http://localhost:3000"),$messageForm=document.querySelector("#message-form"),$messageFormInput=$messageForm.querySelector("input"),$messageFormButton=$messageForm.querySelector("button"),$sendLocationButton=document.querySelector("#send-location"),$messages=document.querySelector("#messages"),messageTemplate=document.querySelector("#message-template").innerHTML,locationMessageTemplate=document.querySelector("#location-message-template").innerHTML,sidebarTemplate=document.querySelector("#sidebar-template").innerHTML,{username:username,room:room}=Qs.parse(location.search,{ignoreQueryPrefix:!0});console.log(username,room);const autoscroll=()=>{const e=$messages.lastElementChild,o=getComputedStyle(e),t=parseInt(o.marginBottom),s=e.offsetHeight+t,r=$messages.offsetHeight;$messages.scrollHeight-s<=$messages.scrollTop+r&&($messages.scrollTop=$messages.scrollHeight)};socket.on("message",e=>{console.log(e);const o=Mustache.render(messageTemplate,{username:e.username,message:e.text,createdAt:moment(e.createdAt).format("h:mm a")});$messages.insertAdjacentHTML("beforeend",o),autoscroll()}),socket.on("locationMessage",e=>{console.log(e);const o=Mustache.render(locationMessageTemplate,{username:e.username,url:e.url,createdAt:moment(e.createdAt).format("h:mm a")});$messages.insertAdjacentHTML("beforeend",o),autoscroll()}),socket.on("roomData",({room:e,users:o})=>{const t=Mustache.render(sidebarTemplate,{room:e,users:o});document.querySelector("#sidebar").innerHTML=t}),$messageForm.addEventListener("submit",e=>{e.preventDefault(),$messageFormButton.setAttribute("disabled","disabled");const o=e.target.elements.message.value;socket.emit("sendMessage",o,e=>{if($messageFormButton.removeAttribute("disabled"),$messageFormInput.value="",$messageFormInput.focus(),e)return console.log(e);console.log("Message delivered!")})}),$sendLocationButton.addEventListener("click",()=>{if(!navigator.geolocation)return alert("Geolocation is not supported by your browser.");$sendLocationButton.setAttribute("disabled","disabled"),navigator.geolocation.getCurrentPosition(e=>{socket.emit("sendLocation",{latitude:e.coords.latitude,longitude:e.coords.longitude},()=>{$sendLocationButton.removeAttribute("disabled"),console.log("Location shared!")})})}),socket.emit("join",{username:username,room:room},e=>{e&&(alert(e),location.href="/")});