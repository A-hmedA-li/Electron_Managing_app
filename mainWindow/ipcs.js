const electron = require('electron') ; 
const ipc = electron.ipcRenderer; 

ipc.on('item:add' , (e, item)=>{
      
    const li = document.createElement('li') ; 
    const itemText = document.createTextNode(item) ; 
    li.appendChild(itemText) ; 
    ul.appendChild(li) ; 
}); 

ipc.on("item:clear", (e)=>{
    ul.innerHTML="" ; 
}); 


ipc.on('db:error', (e)=>{
  console.log("Error") ; 
  alert('could not connect to database') ;
});

ipc.on('db:connected', (e)=>{

  alert('connect succsefully to database') ;
});