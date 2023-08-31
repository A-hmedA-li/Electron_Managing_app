const db = require("../db");

        var scalform = document.getElementById('scalform') ; 
        var clear = document.getElementById('clear') ;
        var keys = {
            'name': 'default',
            'args' :{}
        } ; 
        var savedKeys = {
            'name' : 'keys' ,
            'args' : {
                'name' : 'default', 
                'keys' : [] ,
            }
        } ;
        function addLine(){
            div = document.createElement('div') ;

            input = document.createElement('input') ;
            label =document.createElement('label') ; 
      
            input1 = document.createElement('input') ;
            label1 =document.createElement('label') ; 
            
            // input2 = document.createElement('input') ; 
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
       

        let i = 0; 

        function sendcola (command , item ){
            sendIpc(command , item)  ;
        }
        function send(){
            collectionSavedKeys=[] ; 
            
            keys['name'] = document.getElementById('name').value ; 
            
            inputs =document.querySelectorAll('.send') ; 

            inputs.forEach(element => {
                type = element.childNodes[4].selectedIndex  ; 
         
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
            savedKeys.args.name = keys.name;
            savedKeys.args.keys = collectionSavedKeys ; 
            console.log(savedKeys.args) ;
            console.log(keys) ;
            let myJSON = JSON.stringify(keys.args);
            let ok =  confirm(myJSON);
            
            if (ok){
                sendcola('db:create' , keys) ; 
                db.collection(keys['name']).insertOne(keys['args']) ;
                db.collection('key').insertOne(savedKeys.args) ; 
                try{
                db.colletion('keys')
                }catch(err){

                }
              
                // sendcola('db:create' , savedKeys ) ;
            }
        }