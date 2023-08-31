function changeState(check){
        

    if (!db1){
        document.getElementById('CollectionState').innerHTML = "Not Ready" ; 
        return 
    }
    cleardiv.innerHTML = "" ; 
    scalform.innerHTML = "" ;
    document.getElementById('CollectionState').innerHTML = "مجموعة موجودة" ; 
    displayKeys.style.visibility = 'visible';
    loadCollectionNames() ;
}
async function loadCollectionNames(){
    let collectionList = await db1.listCollections() ; 
    collectionList.forEach(item=>{
    if (item.name !== 'keys'){
        let opt = document.createElement('option') ; 
        opt.value = item.name ;
        opt.innerHTML = item.name ;
        selectCollection.appendChild(opt) ;
    }

})
}

async function loadColllection(select){
    let key = await db1.collection('keys').findOne({'name': select.value}) ; 
    savedKeys = [] ;
    con.innerHTML = "";
    key = key['keys'];
    savedKeys = key ;
    for (x in key){
        let row  = document.createElement('div')
        let name = document.createElement('div')
        let type = document.createElement('div')
        row.classList.add ('row' ) ; 
        row.classList.add('exi') ;
        name.classList.add ("col-sm") ; 
        type.classList.add ("col-sm") ; 
        name.innerHTML = key[x].keyname ; 
        type.innerHTML = key[x].type ; 
        row.appendChild(name) ;
        row.appendChild(type) ; 
        con.append(row) ;

    }
}

function addLines(button){
    div = document.createElement('div') ;
    input = document.createElement('input') ;
    label =document.createElement('label') ; 
    selection = document.createElement('select') ; 
    div.classList.add('send')
    selection.class = 'form-select' ;
    opts = [] ; 
    for (let i = 0 ;i < 3 ; i ++)
            opts.push(document.createElement('option')) ; 
    
    opts[0].innerHTML = 'String' ; 
    opts[1].innerHTML = 'Array' ; 
    opts[2].innerHTML = 'Number' ; 
    opts[0].value = 'String' ; 
    opts[1].value = 'Array' ; 
    opts[2].value = 'Number' ; 
    for (let i = 0 ; i < 3; i ++)
    
        selection.appendChild(opts[i]) ; 
    

    label.innerHTML = 'اسم المفتاح' ; 
    div.appendChild(label) ; 
    div.appendChild(input) ;
    div.appendChild(selection); 
   
    con.appendChild(div) ;

}
async function updateKeys (){
let divs = document.querySelectorAll('.send') ;
divs.forEach(item=>{
    
    savedKeys.push({'keyname':item.childNodes[1].value , 'type' : item.childNodes[2].value })
})
await db1.collection('keys').updateOne({'name' :selectCollection.value } , {$set: {'keys' : savedKeys}})
location.reload() ;
}