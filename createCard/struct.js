function injectCollection(item){
    let col =createCollectionCard(item);
    stuff.appendChild(col) ; 

}
function createCollectionCard(item){
    let card = document.createElement('div') ; 
    card.classList.add('card' , 'align-items-center', 'move') ;
    card.style.color = 'white';
    // card.draggable ="true" ;
    
    
    card.innerHTML=item;
   
    return card ; 
}