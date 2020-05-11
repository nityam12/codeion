
class FriendRequest{

    constructor(makefriendId)
    {
       

        // this.friendid=$('#friendlink');
        this.friendid=document.getElementById('friend-link');
        console.log(this.friendid.text);
    
        
        
        this.connect_friend();
    }

    

   connect_friend(){
           

            let self=this;
            
            this.friendid.addEventListener('click',function(e){
            
                e.preventDefault();
            
        

    let xhrRequest = new XMLHttpRequest();

    if (!xhrRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
      }

      let url=this.getAttribute("href");
      console.log(url);
      xhrRequest.open('POST',url,true);

      xhrRequest.send();

      xhrRequest.onload=function(){
        let response=JSON.parse(xhrRequest.response);
        let friend_status=response.data.friend_status;
        console.log(friend_status);
        if(friend_status){
            self.friendid.innerHTML="Unfriend";
            
            
            
        }
        else{
            self.friendid.innerHTML="Send Friend Request";
          
            
        }
      };

            
           


              


            

    
 
     
      });

    


  
}

}

