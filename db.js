let connection; 
MongoClient = require('mongodb').MongoClient , 
// connectionString = 'mongodb+srv://medbuser:medbpassword@cluster0.r92rq.mongodb.net/excavator?retryWrites=true&w=majority' , 
connectionString = 'mongodb://localhost:27017' ;
module.exports  = {
     MongoClient : require('mongodb').MongoClient , 
    //  connectionString : 'mongodb+srv://medbuser:medbpassword@cluster0.r92rq.mongodb.net/excavator?retryWrites=true&w=majority' , 
        connectionString : 'mongodb://localhost:27017',
     
    createConnection: (cb)=>{
        MongoClient.connect(connectionString).then(client => {
            connection = client ;
            return cb() ; 
        }).catch(err =>{
            console.log("Error in db") ;
            return cb(err) ;
        }); 
    }, 
    getConnection: function (){
        return connection ; 
    },

}


