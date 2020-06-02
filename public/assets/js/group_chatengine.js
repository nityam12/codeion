const socket=io.connect("http://localhost:3000"),$messageForm=document.querySelector("#message-form"),$messageFormInput=$messageForm.querySelector("input"),$messageFormButton=$messageForm.querySelector("button"),$sendLocationButton=document.querySelector("#send-location"),$messages=document.querySelector("#messages"),messageTemplate=document.querySelector("#message-template").innerHTML;socket.on("message",e=>{console.log(e);const t=Mustache.render(messageTemplate,{message:e});$messages.insertAdjacentHTML("beforeend",t)}),$messageForm.addEventListener("submit",e=>{e.preventDefault(),$messageFormButton.setAttribute("disabled","disabled");const t=e.target.elements.message.value;socket.emit("sendMessage",t,e=>{if($messageFormButton.removeAttribute("disabled"),$messageFormInput.value="",$messageFormInput.focus(),e)return console.log(e);console.log("Message delivered!")})}),$sendLocationButton.addEventListener("click",()=>{if(!navigator.geolocation)return alert("Geolocation is not supported by your browser.");$sendLocationButton.setAttribute("disabled","disabled"),navigator.geolocation.getCurrentPosition(e=>{socket.emit("sendLocation",{latitude:e.coords.latitude,longitude:e.coords.longitude},()=>{$sendLocationButton.removeAttribute("disabled"),console.log("Location shared!")})})});