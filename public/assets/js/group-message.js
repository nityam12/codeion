const generateMessage=(e,a)=>({username:e,text:a,createdAt:(new Date).getTime()}),generateLocationMessage=(e,a)=>({username:e,url:a,createdAt:(new Date).getTime()});module.exports={generateMessage:generateMessage,generateLocationMessage:generateLocationMessage};