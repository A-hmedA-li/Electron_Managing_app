

let element = null ;
let snaped = null; 
let snap = document.getElementById('snappingArea') ; 
let base  = null ; 
let  trash = document.getElementById('trash') ;
let snapHeight = 300 ; 
function snapClass(){
    snap.style.height = snapHeight +'px' ;
    snap.style.width = '100%'; 
    snap.style.backgroundColor ='#EFEFEF'; 
}
function snapClassre(){
    
    snap.style.backgroundColor ='#205375'; 
}
onmousedown = function (event){
   

  
    if (event.target.classList.contains('move')){
        
        element = event.target.cloneNode(true);
        base =event.target  ; 
        base.style.backgroundColor = "#112B3C"; 
        createSnap();

        element.style.position = "absolute"
        element.style.left = (event.clientX-element.clientWidth/2) +'px';

        element.style.top = (event.clientY-element.clientHeight/2) +'px';
        element.style.opacity ='0.8'
   
        snapClass();
        document.body.appendChild(element) ;
        onmousemove = movement;
    }

    if (event.target.classList.contains('remove')){
       
        trash.style.display = 'inline' ;
        element = event.target.cloneNode(this);
        base =event.target  ; 
        base.style.backgroundColor = "#112B3C"; 
        // createSnap();

        element.style.position = " absolute"
        element.style.left = (event.clientX-element.clientWidth/2) +'px';

        element.style.top = (event.clientY-element.clientHeight/2) +'px';
        element.style.opacity ='0.7'
   
        snap.classList.add('snap') ;
        document.body.appendChild(element) ;
        onmousemove = movement;
    }
   

}

 movement  =function (event){
        
        element.style.left = (event.clientX-element.clientWidth/2) +'px';

        element.style.top = (event.clientY-element.clientHeight/2) +'px';

       
        

}
onmouseup = function (event){
    if (element){
   
    base.style.backgroundColor= 'black';
    document.body.removeChild(document.body.lastChild) ;
    parent = document.elementFromPoint(event.clientX, event.clientY); 
    if (this.parent.id == 'snappingArea'){
     
        snapHeight += 75 ;
        base.style.backgroundColor="#F66B0E" ;
        parent.appendChild(snaped);
         
    }
   
    if (this.parent.id == 'trash'){
        snapHeight -= 75 ; 
        base.remove() ;
    }

    snapClassre() ;
    element = null ;
    trash.style.display = 'none' ;
    onmousemove = null;
}
}
let values = {}
async function createSnap(){
    snaped=document.createElement('div');
    snaped.classList.add('col' , 'snippet' ,'remove') ;
    let select = document.createElement('select') ;
    let checkDev = document.createElement('div'); 
    let opt  ;
    let label = document.createElement('label'); 
    label.innerHTML = element.innerHTML ;
    label.classList.add("labelText")
    snaped.appendChild(label) ;
        //dp operation
        db.collection(element.innerHTML).find({}).toArray( (err, item)=>{
           
        
            for (i in item){
            values[item[i]['اسم']] = item[i] ;
            opt =document.createElement('option')  ; 
            opt.innerHTML=item[i]['اسم'] ; 
            select.appendChild(opt) ;
            
            }
   
            
        })
   
     
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
    await  db.collection('keys').findOne({'name' : element.innerHTML}).then(item=>{
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
function save(){
    let cardName = document.getElementById('cardName'); 
    cardName.addEventListener('click' , (e)=>{
        cardName.style.border='none' ;
    })
    if (!cardName.value)
    {   
        cardName.placeholder = "هاد الحقل اجباري تعبيه";
        cardName.style.border = "3px solid red" ;
        return 
    }
    let card = {
        'name' : cardName.value, 
        'cardArray': [] 
    }
   
    
    let div =  document.querySelectorAll('.snippet') ;
    div.forEach(item=>{
        let savedKeys= {
            "selectedName" : "default", 
            'isDescending' : false , 
            'checks' : [], 
        }
        let arr = item.childNodes ; 
        savedKeys.collectionName = arr[0].innerHTML ; 
        savedKeys.selectedName = arr[1].value ;
        if (arr[2].style.backgroundColor == "black")
        savedKeys.isDescending = true ; 
        let nestArr = arr[3].childNodes  ;

        for(let i =0  ; i< nestArr.length ; i+=3){
            if (nestArr[i+1].checked )
                savedKeys.checks.push({'name':nestArr[i+2].innerHTML ,
                'value' : values[savedKeys.selectedName][nestArr[i+2].innerHTML]}) ;
                
        }
        
        card.cardArray.push(savedKeys)
    })
  

    dbase.db('useradmin').collection('cards').insertOne(card).then(item=>{
   
        if (item.acknowledged){
             location.reload(); 
        }else{
            alert('Error') ;
        }
         

    }) ;
}   