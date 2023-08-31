const electron = require('electron') ; 
const url = require('url') ; 
const path = require('path') ; 
let {createConnection, getConnection  } = require('./db.js') ;


const {app , BrowserWindow , Menu , ipcMain} = electron; 



let mainWindow; 
let addWindow; 
let addCollection; 
let db ; 
let createACard ; 
let Cards ; 
let backColor = "#312450";
let windowWidth = 1220;
 function connectDB(){
    createConnection((err)=>{
        if (err){
            
            mainWindow.webContents.send("db:error");
            return err ;
        }else{
            db = getConnection() ; 
           
            console.log("connected") ; 
            return true ; 
        }
    
    })
}

//Ready
app.on('ready' ,async ()=>{
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true, contextIsolation: false},
        backgroundColor: backColor,
        width: windowWidth,
    }) ; 
   await mainWindow.loadURL(url.format({

        pathname: path.join(__dirname , 'mainWindow/mainWindow.html'), 
        protocol: 'file:', 
        slashes: true
    })) ;  
    mainWindow.on('close' , ()=>{
        if (db)
        db.close() ; 
        app.quit() ;
    })  
    connectDB() ; 
    const mainMenu = Menu.buildFromTemplate(mailMenuTemplate); 
    Menu.setApplicationMenu(mainMenu); 
 
}); 

const mailMenuTemplate = [
    {   
        //File
        label:'File', 
        submenu: [
            {
                label:"view collections", 
                click(){
                    viewCollections();
                   
                    
                }
            },
            {
                label:"add collection", 
                click(){
                    collectionWindow();

                    
                }
            },
            {
                label:"create card",
                click(){
                    createCard() ;
                }
            },
            {
                label:"view Cards",
                click(){
                    viewCards() ;
                }
            },
            {
                label:"reconnect to database",
                click(){
                   connectDB() ; 
                }
            },
            {
                label:"Quit item", 
                accelerator:'Ctrl+Q'  , 
                click(){
                    if (db)
                    db.close() ;
                    app.quit();
                }
            },
            
            ]
        //-------------------
    }
] ;



// Production
if (process.env.NODE_ENV !=='production'){
    mailMenuTemplate.push ({
        label:"Developer Tools", 
        accelerator:'Ctrl+i'  , 
        click(item , focusedwindow){
            focusedwindow.toggleDevTools() ; 
        }, 
      
    }, 
      {
        role:'reload'
    })
}
    
async function viewCollections(){
    addWindow = new BrowserWindow({ 
        title:"view Collections", 
        webPreferences: {nodeIntegration: true, contextIsolation: false},
        backgroundColor: backColor,
        width: windowWidth,
    }) ; 
   await addWindow.loadURL(url.format({
        pathname: path.join(__dirname , 'viewCollections/addWindow.html'), 
        protocol: 'file:', 
        slashes: true
    })) ;
     
    addWindow.on('close' , ()=>{
        addWindow = null;
    })

}
async function viewCards(){
    Cards = new BrowserWindow({ 
        title:"Cards", 
        webPreferences: {nodeIntegration: true, contextIsolation: false},
        backgroundColor: backColor,
        width: windowWidth,
    }) ; 
   await Cards.loadURL(url.format({
        pathname: path.join(__dirname , 'viewCards/window.html'), 
        protocol: 'file:', 
        slashes: true
    })) ;
     
    Cards.on('close' , ()=>{
        addWindow = null;
    })

}
async function createCard(){
    createACard = new BrowserWindow({ 
        title:"view Collections", 
        webPreferences: {nodeIntegration: true, contextIsolation: false},
        backgroundColor: backColor,
        width: windowWidth,
    }) ; 
   await createACard.loadURL(url.format({
        pathname: path.join(__dirname , 'createCard/window.html'), 
        protocol: 'file:', 
        slashes: true
    })) ;
     
    mainWindow.on('close' , ()=>{
        createACard = null;
    })

}

function collectionWindow(){
    addCollection = new BrowserWindow({
        webPreferences: {nodeIntegration: true, contextIsolation: false},
        backgroundColor: backColor,
        width: 1024,
    }) ; 
    addCollection.loadURL(url.format({
        pathname:path.join(__dirname, 'addCollection/addCollectionWindow.html') ,
        protocol:'file', 
        slashes:true
    })) ; 
    addCollection.on('close', ()=>{
        createCollection=null ; 
    }) ;
    
    
}
ipcMain.on ('db:create' ,async (event , arg)=>{
    s = db.db('excavator') ;
   
   let result= await s.collection(arg['name']).insertOne(arg['args']) ;
   if (arg.name == 'keys'){
       try{
        s.collection('keys').createIndex({"name" :1 } , {unique : true}) ;
       }catch(err){
        mainWindow.webContents.send('db:error' , 'dupKey');
       }

    
    }
   if (result){
    console.log(result) ; 
    console.log('added'  , arg) ;
   }
   else {
       console.log('error adding ') ; 
   }

    
})
ipcMain.on('test:page',  (event , arg)=>{
    console.log(arg) ;
})
ipcMain.on('db:update' , async (event, arg)=>{
    s = db.db('excavator') ;
    
    let result = await s.collection('keys').update({'name' : arg.args.name} , {$set: {'keys' :  arg.args.keys}})
    if (result){
        console.log(result) ; 
        console.log('updated'  , arg.args) ;
       }
       else {
           console.log('error adding ') ; 
       }
})
