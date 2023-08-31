const dbConnection = require('../db.js') ;
var db1  ;
var scalform = document.getElementById('scalform') ;
var cleardiv = document.getElementById('clear'); 
displayKeys = document.getElementById('displayKeys') ; 
var con = document.getElementById('con') ;
selectCollection = document.getElementById('selectCollection') ;
spinner = document.getElementById('spinner') ;

collectionSavedKeys = [];
var savedKeys = [] ;




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
        db1 = dbase.db('excavator');

        console.log('closed') ; 
    }catch(err){
        alert(err);
    }
    spinner.style.display = "none" ;
}


window.onbeforeunload = function(){
    dbase.close() ;
}

function addLine(){
    div = document.createElement('div') ;
    input = document.createElement('input') ;
    label =document.createElement('label') ; 
    input1 = document.createElement('input') ;
    label1 =document.createElement('label') ; 
    selection = document.createElement('select') ; 
    div.classList.add('send')
    selection.class = 'form-select' ;
    opts = [] ; 
    for (let i = 0 ;i < 3 ; i ++)
            opts.push(document.createElement('option')) ; 
     
    opts[0].innerHTML = 'String' ; 
    opts[1].innerHTML = 'Array' ; 
    opts[2].innerHTML = 'Number' ; 
    opts[0].value = '1' ; 
    opts[1].value = '2' ; 
    opts[2].value = '3' ; 
    for (let i = 0 ; i < 3; i ++)
    
        selection.appendChild(opts[i]) ; 
    

    label.innerHTML = 'اسم المفتاح' ; 
    div.appendChild(label) ; 
    div.appendChild(input) ;
    label1.innerHTML = 'قيمته' ;
    div.appendChild(label1) ; 
    div.appendChild(input1) ; 
    // div.appendChild(input2) ; 
    div.appendChild(selection); 
    scalform.appendChild(div) ;
    
}
function send(){
    let divs = document.querySelectorAll('.send') ;  
    let keys = {
        'name' : document.getElementById('name').value , 
        'args' : {} 
    }
    keys.args = {};
    collectionSavedKeys = [] ;
    divs.forEach(element => {
        let type = element.childNodes[4].selectedIndex  ; 
        if (type == '0'){
            keys.args[element.childNodes[1].value] = element.childNodes[3].value ;
            collectionSavedKeys.push({'keyname' :element.childNodes[1].value  , 'type' : 'String'} )
        }
        if (type == '1'){
            keys.args[element.childNodes[1].value] = element.childNodes[3].value.split(',') ;
            collectionSavedKeys.push({'keyname' :element.childNodes[1].value  , 'type' : 'Array'} )
        }
        if (type == '2'){
            keys.args[element.childNodes[1].value] = parseInt(element.childNodes[3].value) ;
            collectionSavedKeys.push({'keyname' :element.childNodes[1].value  , 'type' : 'Number'} )
        }
        element.childNodes[3].value="";
    });

    
    
    let jsons = JSON.stringify(keys.args) ; 
    let ok = confirm(jsons) ;
    keys.args['وقت الانشاء'] =Date.now() ;
    savedKeys = {
        'name' : keys['name'],
        'keys' : collectionSavedKeys ,
    }

    if (ok){
        db1.collection(keys.name).insertOne(keys.args) ;
        db1.collection('keys').insertOne(savedKeys)
    }
}