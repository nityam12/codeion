const socket=io.connect("http://54.83.172.113:3000"),$messageForm=document.querySelector("#message-form"),$messageFormInput=$messageForm.querySelector("input"),$messageFormButton=$messageForm.querySelector("button"),$sendLocationButton=document.querySelector("#send-location"),$messages=document.querySelector("#messages"),messageTemplate=document.querySelector("#message-template").innerHTML,locationMessageTemplate=document.querySelector("#location-message-template").innerHTML,sidebarTemplate=document.querySelector("#sidebar-template").innerHTML,{username:username,room:room}=Qs.parse(location.search,{ignoreQueryPrefix:!0}),autoscroll=()=>{const e=$messages.lastElementChild,t=getComputedStyle(e),s=parseInt(t.marginBottom),o=e.offsetHeight+s,r=$messages.offsetHeight;$messages.scrollHeight-o<=$messages.scrollTop+r&&($messages.scrollTop=$messages.scrollHeight)};socket.on("message",e=>{const t=Mustache.render(messageTemplate,{username:e.username,message:e.text,createdAt:moment(e.createdAt).format("h:mm a")});$messages.insertAdjacentHTML("beforeend",t),autoscroll()}),socket.on("locationMessage",e=>{const t=Mustache.render(locationMessageTemplate,{username:e.username,url:e.url,createdAt:moment(e.createdAt).format("h:mm a")});$messages.insertAdjacentHTML("beforeend",t),autoscroll()}),socket.on("roomData",({room:e,users:t})=>{const s=Mustache.render(sidebarTemplate,{room:e,users:t});document.querySelector("#sidebar").innerHTML=s}),$messageForm.addEventListener("submit",e=>{e.preventDefault(),$messageFormButton.setAttribute("disabled","disabled");const t=e.target.elements.message.value;socket.emit("sendMessage",t,e=>{if($messageFormButton.removeAttribute("disabled"),$messageFormInput.value="",$messageFormInput.focus(),e)return console.log(e)})}),$sendLocationButton.addEventListener("click",()=>{if(!navigator.geolocation)return alert("Geolocation is not supported by your browser.");$sendLocationButton.setAttribute("disabled","disabled"),navigator.geolocation.getCurrentPosition(e=>{socket.emit("sendLocation",{latitude:e.coords.latitude,longitude:e.coords.longitude},()=>{$sendLocationButton.removeAttribute("disabled")})})}),socket.emit("join",{username:username,room:room},e=>{e&&(alert(e),location.href="/")});