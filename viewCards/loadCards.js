
const dbConnection = require("../db");
let spinner = document.getElementById('spinner') ; 
let db
let Cards= [] ;
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
        db = dbase.db('useradmin');

        console.log('connected') ; 
    }catch(err){
        console.log(err) ;
        alert(err);
    }
     
        spinner.style.display="none" ;
        initCardsView() ;
}
async function loadCards(){
    Cards = [] ;
    let x = await db.collection('cards').find({}).forEach(item=>{
       
        Cards.push(item) ;
    })
}

async function initCardsView (){
    await loadCards() ;
  
    document.body.innerHTML = "" ;
    if (Cards.length == 0)
    document.body.innerHTML = "<h1> ما في بطاقات <br> روح اعمل وحدة </h1>"
    let con = document.createElement('div') ; 
    con.classList.add('container') ; 
    con.id= 'con' ; 
    let d_flex = document.createElement('div') ; 
    d_flex.classList.add('d-flex') ; 
    let initRow = document.createElement('div'); 
    initRow.classList.add('row') ; 
    d_flex.appendChild(initRow);
    con.appendChild(d_flex); 
    document.body.appendChild(con) ;
    Cards.forEach(item=>{
        let scard = document.createElement('div') ; 
        scard.onclick = function(){
            loadSingleView(item.name) ;
        }
        let cardBody = document.createElement('div') ;
        scard.classList.add('card') ;
        cardBody.classList.add('card-body') ;
        cardBody.innerHTML = item.name ; 
        scard.appendChild(cardBody) ;
        initRow.appendChild(scard);
    })
    
}
