



let card ;
function loadSingleView(name){

    Cards.forEach(item=>{
       if (item.name == name)
            card = item;
            
   });
   console.log(card) ;


    document.body.innerHTML="" ;
   
    let container = createContainer(document.body) ;

    let nav = createNav(container) ;
   
    let h4 = document.createElement('h4') ;
    nav.appendChild(h4) 
    let buttonArea = document.createElement('div') ; 
    createButton(buttonArea , 'عدلا' , changeCardView, card.name) ;
    createButton(buttonArea , 'ارجع لورا' , initCardsView) ;
    let delbtn =createButton(buttonArea , 'احذفا' , deleteCard) ;
    delbtn.style.backgroundColor = '#ff5555' ;
    createButton(buttonArea , 'تمام' , send) ;

    nav.appendChild(buttonArea) ; 
    let background = createBackground(container) ;
 
    h4.innerHTML=card.name ;
;
    let mainUl =document.createElement('ul') ; 
    mainUl.classList.add('mainUl') ;
    background.appendChild(mainUl)
    card.cardArray.forEach(item=>{
            createMiniUl(mainUl ,item );
    })
 


}

function createButton(parent , innerHTML , click, args){
    
    let goback = document.createElement('button') ;
    goback.classList.add('btn'  , 'justify-content-end') ;
    goback.innerHTML= innerHTML ; 
    goback.onclick = function(){
        click(args) ;
    }
    parent.appendChild(goback) ;
    return goback ;
}
function createContainer(parent){
    let container = document.createElement('div') ;
    container.classList.add('container') ;
    parent.appendChild(container) ; 
    return document.body ;
}
function createNav(parent){
    let nav = document.createElement('div') ; 
    nav.style.width = "100%"
    nav.classList.add('nave' ,'d-inline-flex', 'p-2', 'justify-content-between') ;
    parent.appendChild(nav) ;
    return nav ; 
}
function createBackground(parent){
    let background = document.createElement('div') ;
    background.classList.add('background' )
    parent.appendChild(background) ; 
    return background
}
function createMiniUl(parent , item){
    let mainLi = document.createElement('li') ; 
    let miniUl = document.createElement('ul') ;
    miniUl.classList.add('senderPack') ;
    mainLi.appendChild(miniUl) ;
    parent.appendChild(mainLi) ; 

    let groupName = document.createElement('li') ; 
    groupName.innerHTML = item.collectionName ; 
    miniUl.appendChild(groupName) ; 
    let selectedName = document.createElement('li') ; 
    selectedName.innerHTML =item.selectedName ; 
    miniUl.appendChild(selectedName) ;
    item.checks.forEach(check=>{
        let li = document.createElement('li') ;
        miniUl.appendChild(li) ;
        let label = document.createElement('label') ;
        label.innerHTML = check.name ; 
        li.appendChild(label) ;
        let input = document.createElement('input') ; 
        li.appendChild(input) ; 
        let btn = document.createElement('button') ; 
        btn.onclick = function (){
            descending(this) ;
        }
        btn.classList.add('btn') ;
        btn.style.backgroundColor = '#F2F2F2' ;
        btn.innerHTML ='+' ; 
        li.appendChild(btn) ;
        let available  = document.createElement('label') ; 
        // انتبه عند التغيير للاكنولجمنت
        available.innerHTML = ' موجود  ' + check.value ;
        li.appendChild(available) ;
    })
}

function descending(button){

   

    if (button.style.backgroundColor=="rgb(242, 242, 242)" ){
    button.style.backgroundColor="black" ; 
    button.style.color ="white" ;
    }else{
        button.style.backgroundColor="#F2F2F2" ; 
        button.style.color ="black" ; 
    }
    
    
}
 function send(){
  
    let miniUl = document.querySelectorAll('.senderPack'); 
    miniUl.forEach( async ul =>{
     
        let senderPack = {
            'change' :[]  ,
        }
        let upadtevalue ; 
        ul = ul.childNodes ; 
        let savedChenges = {} ;
        senderPack.collectionName = ul[0].innerHTML ; 
        senderPack.itemName = ul[1].innerHTML ; 
        for ( let i = 2 ; i < ul.length ; i++){
         
          
            
            let field = ul[i].childNodes  ; 
   
            savedChenges[ field[0].innerHTML ] = -parseInt(field[1].value );
           if (field[2].style.backgroundColor =='black')
                savedChenges[ field[0].innerHTML ] =  savedChenges[ field[0].innerHTML ]*-1 ;
            console.log(senderPack) ;
            for (p in card.cardArray){
                console.log(card.cardArray[p].selectedName == senderPack.itemName );
                if (card.cardArray[p].collectionName == senderPack.collectionName && card.cardArray[p].selectedName == senderPack.itemName){
                    let arr = card.cardArray[p].checks; 
                 
                    for (j in arr){
                        if (arr[j].name == field[0].innerHTML){
                            arr[j].value += savedChenges[ field[0].innerHTML] ;
                            
                        }
                     }
                }
            }
            upadtevalue = field[3] ;
        }
        
        console.log(savedChenges) ;

       let res = await  dbase.db('excavator').collection(senderPack.collectionName).updateOne({'اسم':senderPack.itemName} , {$inc:savedChenges} )
       console.log(res);
        if (res.acknowledged){
            db.collection('cards').replaceOne({'_id' : card._id}, {'name' : card.name , 'cardArray' : card.cardArray})
            await loadCards() ;
            loadSingleView() ;
        }
           

    })
  
}
async function deleteCard(){
    let ok = confirm('بدك تحذفا عن جد؟') ;
    if (ok){
        
      let res = await db.collection('cards').deleteOne({'_id':card._id}) ;
      console.log(res) ;
    }

    initCardsView(); 
}
window.onbeforeunload =  function(){

    dbase.close() ;

}