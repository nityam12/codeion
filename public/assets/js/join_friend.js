class FriendRequest{constructor(e){this.friendid=document.getElementById("friend-link"),console.log(this.friendid.text),this.connect_friend()}connect_friend(){let e=this;this.friendid.addEventListener("click",(function(n){n.preventDefault();let t=new XMLHttpRequest;if(!t)return alert("Giving up :( Cannot create an XMLHTTP instance"),!1;let i=this.getAttribute("href");console.log(i),t.open("POST",i,!0),t.send(),t.onload=function(){let n=JSON.parse(t.response).data.friend_status;console.log(n),e.friendid.innerHTML=n?"Unfriend":"Send Friend Request"}}))}}