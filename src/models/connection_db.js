const mysql = require('mysql');

if(process.env.NODE_ENV == "production"){
  const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
  connection.getConnection((err, connect) => {
    if(err) 
        console.error("Unable to connect to the database:", err)    
    if(connect)
        connect.release()
    return;
  }); 
  module.exports = connection;

} else {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bm_web'
  });
  connection.connect(function (err) {
    if(err){
        console.error("Unable to connect to the database:", err);
    }else{
        console.log("Connection has been established successfully.");
    }
  });

  module.exports = connection;
}

