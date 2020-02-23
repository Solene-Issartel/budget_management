const mysql = require('mysql2');


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