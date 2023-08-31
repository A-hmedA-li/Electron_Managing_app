const connection = require('../db.js') ; 
let db ; 
let data ; 
  
collections = [] ;
collectionKeys = [] ;

function changeState(input){
    select= document.getElementById('collections');
    select.style.visibility='visible' ;
    let optDefualt = document.createElement('option'); 
    optDefualt.innerHTML="اختر مجموعة"; 
    select.appendChild(optDefualt);
    connection.createConnection((err)=>{
        if (err){
    
   
            console.log(err) ;
        }else{
            db = connection.getConnection() ; 
   
            scalform.innerHTML ='' ;
            clear.innerHTML= "" ;
            document.getElementById('CollectionState').innerHTML= "مجموعات موجودة";
     
          
             data = db.db('excavator');
            collectionsNames = data.listCollections() ; 
            collectionsNames.toArray().then(res=>{
                res.forEach(item=>{
                    let opt = document.createElement('option') ; 
                    opt.innerHTML=item.name ;
                    opt.value=item.name;
                    collections.push(item.name) ;
                    select.appendChild(opt);

                })
            })

        }
    })
}
async  function  loadColllection(select){
    savedKeys.args.keys = [] ;
    clear.innerHTML = "" ;
    con = document.getElementById('con'); 
    invs =document.getElementById('invs') ; 
    invs.style.visibility="hidden" ;
    con.innerHTML = "" ;
    let q = 0 ;
   await data.collection(select.value).find().forEach( item=>{
        if (q == 0){
            let len = collectionKeys.length;
            for (let j = 0 ; j <  len; j ++)
                collectionKeys.pop() ; 
            for (let x in item){
                collectionKeys.push(x);
            }
            q =1 ;
        }
        for (let x in item){

            let row  = document.createElement('div')
            let key = document.createElement('div')
            let value = document.createElement('div')
            let hr = document.createElement('hr'); 
            row.classList.add ('row' ) ; 
            key.classList.add ("col-sm") ; 
            value.classList.add ("col-sm") ; 
            key.innerHTML =x ; 
            value.innerHTML = item[x] ; 
            row.appendChild(key) ;
            row.appendChild(value) ; 
            con.appendChild(row);
            con.appendChild(hr) ;

        }
    })
    let labels ;
    let vlaues ;
  
    
    scalform.innerHTML = "" ; 
    button = document.createElement('button') ; 
    button.classList.add ('btn-dark', 'btn'); 
    button.innerHTML="ارسل"; 
    clear.appendChild(button) ;
    button.onclick = async function (){
        keys['name'] = select.value ; 
    inputs =document.querySelectorAll('.send') ; 
    
    inputs.forEach(element => {
        type = element.childNodes[2].selectedIndex  ;
    
        console.log(type) ;
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

    
    });

    let myJSON = JSON.stringify(keys.args);
    
    let chouse = confirm(myJSON) ;
     
    if (chouse){
     
        sendcola('db:create' , keys) ; 
        sendcola("db:update" , savedKeys) ;
        db.close() ;
        }
    }
  
    for (x in collectionKeys){
        if (x == 0)
            continue ; 
        labels =document.createElement('label') ;
        labels.for = x ; 
        labels.innerHTML = collectionKeys[x];
        values =document.createElement('input') ; 
        selection = document.createElement('select') ; 
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
        div = document.createElement('div') ; 
        div.appendChild(labels) ; 
        div.appendChild(values) ; 
        div.appendChild(selection) ; 
        div.classList.add('send') ;
        scalform.appendChild(div) ;
        
    }
    
    
}
function quit(){
    db.close(); 
    console.log('closed')
}