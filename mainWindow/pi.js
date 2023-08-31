const dbConnection = require("../db");
let db ;
let colorCoded = 2000000 ; 

spinner =document.getElementById('spinner')
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

      console.log('connected') ; 
  }catch(err){
      console.log(err) ;
      alert(err);
  }
      loadPis()
      spinner.style.display="none" ;
      
}
window.onbeforeunload =  function(){

  dbase.close() ;

}
function loadPis(){
  let collections = db.listCollections()
      collections.forEach(col=>{
        if (col.name == 'keys')
          return ;
        let xvals = []
        let yvals = []
        db.collection(col.name).find().forEach(item=>{
          console.log(item)
          // xvals.push(item['اسم']);
          xvals.push(item['اسم'])
          yvals.push(item['كمية '])
        })


        createPi(document.body , col.name ,col.name, xvals , yvals)

      })
}

function createPi(parint , id ,description , xValues , yValues ,  ){
  let canvas = document.createElement('canvas')
  canvas.classList.add('pi')
  canvas.id = id ; 

  
  canvas.classList.add('pi')
  parint.appendChild(canvas)
  canvas.style.display= 'inline'

  // xValues = ["Italy", "France", "Spain", "canada", "Argentina"];
  // yValues = [55, 49, 44, 24, 15];

  barColors = [

  ];
  colorCoded += Math.floor(Math.random() * 1000000);
console.log(xValues.length)
  for ( let i = 0  ; i <10 ; i ++){
    barColors.push('#' + colorCoded.toString(16));
    colorCoded+=50;
  }
  
  new Chart(id, {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: description
      }
    }
  });
}
