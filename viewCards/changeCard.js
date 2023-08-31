
let trash ;
async function changeCardView(cardName){
    document.body.innerHTML = "" ;
    document.body.style.backgroundColor = '#456789'
    let container = document.createElement('div') ;
    document.body.appendChild(container) ;
    container.classList.add('container') ;
    
    let header = d_flexfunction(cardName) ; 
    container.appendChild(header) ;
    let stuff = createStuff() ; 
    container.appendChild(stuff) ;
    let snappingArea = createAndAppend(container , 'div')
    snappingArea.classList.add('col')
    info =  db.collection('cards').find({'name' : cardName}).toArray( (err , item)=>{
   
        item = item[0].cardArray; 
        for (i in item){
            console.log(item[i])
            createSnap(item[i], snappingArea)
        }
    })
   

    

}
async function createSnap(splash , snappingArea){
  
    let snaped=document.createElement('div');
    snaped.classList.add('col' , 'snippet' ,'remove') ;
    let select = document.createElement('select') ;
    let checkDev = document.createElement('div'); 
    let opt  ;
    let label = document.createElement('label'); 
    label.innerHTML = splash.collectionName ;
    label.classList.add("labelText")
    snaped.appendChild(label) ;
        //dp operation
        dbase.db('excavator').collection(splash.collectionName).find({}).toArray( (err, item)=>{
           
        
            for (i in item){
            // values[item[i]['اسم']] = item[i] ;
            opt =document.createElement('option')  ; 
            opt.innerHTML=item[i]['اسم'] ; 
            select.appendChild(opt) ;
            
            }
   
            
        })
        console.log(select)
        select.value = splash.selectedName
     
    let btn = document.createElement('button') ;
        btn.classList.add('btn') ;  
        btn.classList.add('btn-outline-dark')
        btn.classList.add('btn-sm');

        btn.style.backgroundColor="white" ; 
         btn.style.color ="black" ; 
        btn.innerHTML ='تنازلي بدك؟' 
        btn.onclick = function(){
            descending(this)
        }
    snaped.appendChild(select) ;

    snaped.appendChild(btn) ;
    await  dbase.db('excavator').collection('keys').findOne({'name' : splash.collectionName}).then(item=>{
        let arr = item.keys ;
        
    for (k in arr){
        let obj = arr[k] ;
        if (obj.type == "Number"){
            let br =document.createElement('br')  ; 
            let input = document.createElement('input') ; 
            let label = document.createElement('label') ; 

            input.type="checkbox" ; 
            label.innerHTML = obj.keyname ;
            label.style.color= 'white' ;
            checkDev.appendChild(br) ;
            checkDev.appendChild(input) ;
            checkDev.appendChild(label);
            


        }
    }
  
})
   snaped.appendChild(checkDev) ;
   snappingArea.appendChild(snaped)
    return snaped
}
function descending(button){

    
    if (button.style.backgroundColor=="white" ){
    button.style.backgroundColor="black" ; 
    button.style.color ="white" ;
    }else{
        button.style.backgroundColor="white" ; 
        button.style.color ="black" ; 
    }
    
    
}
function displayCardConf(cardName){
    console.log(card) ;
}
function createCollectionCard(item){
    let card = document.createElement('div') ; 
    card.classList.add('cardch' , 'align-items-center', 'move') ;
    card.style.color = 'white';
    // card.draggable ="true" ;
    
    
    card.innerHTML=item;
   
    return card ; 
}
function createStuff(){
    let stuff = document.createElement('div');
    stuff.id = 'stuff';
    stuff.style.backgroundColor = '#EFEFEF'; 
    stuff.classList.add('row') ;
    loadCollections(stuff);
 
    
    return stuff

}
async function loadCollections(stuff){
    let col = await dbase.db('excavator').listCollections();
    col.forEach(item=>{
        if (item.name != 'keys')
            stuff.appendChild(createCollectionCard(item.name)) ; 
    })
}
function d_flexfunction(cardName){
    let d_flex = document.createElement('div') ; 
    d_flex.classList.add('d-flex') ;
    let p =createP_2() ;
    d_flex.appendChild(p) ;
    let btn = createheaderButton(p, 'احفظ', saveChanges , 'btn');

    let p1 = createP_2() ; 
    createAndAppend(p1 , 'h1', cardName) ; 
    d_flex.appendChild(p1) ;

    trash = createAndAppend(d_flex , 'div', 'trash') ;
    trash.classList.add('trash');
   
    return d_flex ;

      
}
function createP_2(){
    p_2 = document.createElement('div')
    p_2.classList.add('p-2') ; 
    return p_2 ;
}
function createAndAppend(parent , child , innerHTML) {
    let ele = document.createElement(child) ;
    if (innerHTML) 
        ele.innerHTML = innerHTML ;  
    parent.appendChild(ele)
    return ele ; 
} 
function createheaderButton(parent , innerHTML , callback , cls){
    let btn = document.createElement('button') ; 
    btn.innerHTML = innerHTML ; 
    btn.onclick = function (){
        callback(this) ;
    }
    btn.classList.add(cls) ;
    parent.appendChild(btn) ; 

    return btn ; 
}
function saveChanges(){
    console.log('saveChanges') ;
}