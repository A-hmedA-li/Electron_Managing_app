const dbConnection = require('../db.js') ;
var stuff = document.getElementById('stuff') ;
var spinner = document.getElementById('spinner') ;
var dbase ;
var db ;

function connect (){

    return new Promise( async (resolve , reject)=>{
        try{
        let dbae = await dbConnection.MongoClient.connect(dbConnection.connectionString)
        resolve(dbae) ;
        }
        catch(err) {
            reject(err) ;
        }
    }) ;
    
}
window.onload = async (event)=>{
    try{
        dbase = await connect() ; 
        db = dbase.db('excavator');

        console.log('connected') ; 

    }catch(err){
        alert(err);
    }
    collectionList = await db.listCollections() ; 
    spinner.style.display = 'none' ;
    collectionList.forEach(item=>{
        if (item.name !== 'keys' && item.name !=='cards'){
        injectCollection(item.name)
        }
        

    })

}

window.onbeforeunload =  function(){

    dbase.close() ;

}