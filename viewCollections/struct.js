const ObjectId = require('mongodb').ObjectId;
const dbConnection = require('../db.js') ;
const ipc = require('electron').ipcRenderer ;
select = document.getElementById('select') ; 
initForm = document.getElementById('initForm') ;
sendButton = document.getElementById('sendButton') ;
cleardiv = document.getElementById('clear')  ;
spinner = document.getElementById('spinner') ;


var dbase ;
var db ;
var  mr ; 

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

        console.log('closed') ; 
    }catch(err){
        alert(err);
    }
    collectionList = await db.listCollections() ; 
    
    collectionList.forEach(item=>{
        if (item.name !== 'keys'){
             
        let opt = document.createElement('option') ; 
        opt.value = item.name ;
        opt.innerHTML = item.name ;
        select.appendChild(opt) ;
        }
        spinner.style.display = "none" ;

    })
}
async function loadCollection(select){
    initForm.innerHTML = "" ;
    sendButton.style.visibility  = 'visible';
    cleardiv.innerHTML ="" ; 
    spinner.style.display = "inline" ;
    let collecton = await db.collection('keys').findOne({'name': select.value})
    let check = 0 ;
    for (key in collecton.keys){
        if (key == '_id')
            continue; 
        if (check === 0){
            mainInput = insertInputs(collecton.keys[key]['keyname'] , collecton.keys[key]['type']) ;
            check =1 ;
        }
        else
        insertInputs(collecton.keys[key]['keyname'] , collecton.keys[key]['type']) ;

    }
     db.collection(select.value).find().forEach(item=>{
          let innerDiv = document.createElement('div') ;
  
            for (x in item){
                if (x == "وقت الانشاء")
                    innerDiv.appendChild(insertClear(x ,new Date(item[x]).toString().split("GMT")[0] )) ;
                else
                    innerDiv.appendChild(insertClear(x , item[x]));
                
            }

            
            let hr = document.createElement('hr'); 
            createButton(innerDiv , 'احذف' , deletethis)
          
            createButton (innerDiv , 'عدل' , update);
            let ex =createButton (innerDiv , 'تمام' , sendex);
            ex.style.display = 'none' ;


            cleardiv.appendChild(innerDiv) ;
          
    }) ;    
    spinner.style.display = "none" ;

    
}
let mainInput ; 
function insertInputs( keys  ,type ){

        
        let input = document.createElement('input') ; 
        let label = document.createElement('label') ; 
        let p = document.createElement('span') ; 
        let div = document.createElement('div') ;
        label.innerHTML = keys ; 
        p.innerHTML = type ;
        div.classList.add('data') ;
        div.appendChild(label) ;
        div.appendChild(input) ;
        div.appendChild(p) ;
        initForm.appendChild(div) ;
        return input

}
function insertClear (key , value){
  
    let row  = document.createElement('div')
    let keys = document.createElement('div')
    let values = document.createElement('div')
    row.classList.add ('row' ) ; 
    keys.classList.add ("col-sm") ; 
    values.classList.add ("col-sm") ; 
    keys.innerHTML =key ; 
    values.innerHTML = value; 
    row.appendChild(keys) ;
    row.appendChild(values) ;
    if (key == '_id')
        row.style.display = 'none' ;
    return row ; 
 
    cleardiv.appendChild(row);

    
    
}
document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    
    if (charCode == 13)
        add()
};
function add(){
    let innerDiv = document.createElement('div') ;
    let snew ; 
    let senderPack={
        'name' : 'defualt', 
        'args' :{}
    };
    senderPack.name = select.value ;
    let divs = document.querySelectorAll('.data') ; 
    divs.forEach(item=>{
        console.log(item)
        if (item.childNodes[2].innerHTML == "Number")
            senderPack.args[item.childNodes[0].innerHTML] = parseInt(item.childNodes[1].value) ; 
        if (item.childNodes[2].innerHTML == "String")
        senderPack.args[item.childNodes[0].innerHTML] =item.childNodes[1].value ; 
        if (item.childNodes[2].innerHTML == "Array")
            senderPack.args[item.childNodes[0].innerHTML] =item.childNodes[1].value.split(',') ; 
        item.childNodes[1].value = ""
          snew =  insertClear(item.childNodes[0].innerHTML, senderPack.args[item.childNodes[0].innerHTML]);
          innerDiv.appendChild(snew);
    }) ;
    let date = Date.now() ; 
    date = new Date(date) ;
    date =date.toString() ;
    snew =insertClear ('وقت الانشاء' , date.split('GMT')[0])  ;
    innerDiv.appendChild(snew) ;
    cleardiv.appendChild(innerDiv) ;
    //append horizantl divider
    let hr = document.createElement('hr'); 
    cleardiv.appendChild(hr) ; 

    senderPack.args['وقت الانشاء'] = Date.now() ;
    console.log(senderPack)
    db.collection(select.value).insertOne(senderPack.args) ;
    mainInput.focus()
}
async function deletethis (btn){
    // delete record by the delete button  
    let res = await db.collection(select.value).deleteOne({
        '_id' :ObjectId(btn.childNodes[0].childNodes[1].innerHTML)
    }); 
    console.log(res) ;   
    btn.remove() ;
}

function update(parent){
    // pressing mofify
    let nodes = parent.childNodes; 
    let id = nodes[0].childNodes[1].innerHTML ;

    for (let i = 1 ; i < nodes.length -4; i++){
        let node = nodes[i].childNodes[1]; 
        let html = node.innerHTML ; 
        node.innerHTML = "" ;
        let input = document.createElement('input') ; 
        node.appendChild(input) ;
        input.placeholder = html ; 
    }
    nodes[nodes.length-3].style.display = 'none' ;
    nodes[nodes.length-2].style.display = 'none' ;
    nodes[nodes.length-1].style.display = "inline" ;


}

async function sendex(parent){
    // after pressing modify this is for tamam
    let nodes = parent.childNodes; 
    let id = nodes[0].childNodes[1].innerHTML ;
    let senderPack={
        'name' : 'defualt', 
        'args' :{}
    };
    
    for (let i = 1 ; i < nodes.length -4; i++){
        let value =nodes[i].childNodes[1].childNodes[0]
        let ans = value.value
        console.log(!isNaN(parseInt(value.placeholder)))
        if (!isNaN(parseInt(value.placeholder)))
            ans =parseInt(value.value)
        if (!isNaN(parseFloat(value.placeholder)))
            ans=parseFloat(value.value)
        if (value.value === ""){
            ans = value.placeholder
            if (!isNaN(value.placeholder))
                ans =parseInt(value.placeholder)
            if (!isNaN(parseFloat(value.placeholder)))
                ans=parseFloat(value.placeholder)    
            }
        senderPack [nodes[i].childNodes[0].innerHTML] =  ans; 
        node = nodes[i].childNodes[1].childNodes[0];
  
        node.parentElement.innerHTML = ans
    }
    nodes[nodes.length-3].style.display = 'inline' ;
    nodes[nodes.length-2].style.display = 'inline' ;
    nodes[nodes.length-1].style.display = "none" ;
    console.log(senderPack);
    let res = await db.collection(select.value).updateOne({'_id': ObjectId(id)} , {$set :senderPack}) ;
    console.log(res);
  
}
function createButton(parent , innerHTML , click){
    let goback = document.createElement('button') ;
    goback.classList.add('btn'  , 'justify-content-end' ,'btn-secondary') ;
    goback.innerHTML= innerHTML ; 
    goback.style.margin = "2px" ;
    goback.onclick = function(){
        click(this.parentElement) ;
    }
    parent.appendChild(goback) ;
    return goback ;
}

window.onbeforeunload =  function(){
     dbase.close() ;
}
