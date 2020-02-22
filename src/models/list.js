let co = require('./connection_db');

class List {
    constructor(){
        this.id_list;
        this.total_price_list;
        this.date_list;
        this.id_user;

    }

    static create(price,date,id_user,cb) {
        co.query('INSERT INTO lists SET total_price_list = ? AND date_list = ? AND id_user = ?', [price,date,id_user], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static delete(id,cb){
        co.query('DELETE FROM lists WHERE id_list = ?', [id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static update(id,price,date,id_user,cb){
        co.query('UPDATE lists SET total_price_list = ?, date_list = ?, id_user = ? WHERE id_list = ?', [price,date,id_user,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static findById(id,cb){
        co.query('SELECT * FROM lists WHERE id_list = ?', [id], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static findByUser(id_user,cb){
        co.query('SELECT * FROM lists WHERE id_user = ?', [id_user], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static findByMonth(month,id_user,cb){ //month is an int (1:january, 2:feb etc.)
        co.query('SELECT * FROM lists WHERE id_user = ? AND MONTH(date_list) = ?', [id_user,month], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }
}

// List.init({
//     total_price_list: {
//         type: sq.FLOAT,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
//     date_list: {
//         type: sq.DATE,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
//     id_user: {
//         type: sq.INTEGER,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
// }, {
//     sequelize,
//     timestamps: false,
// });

module.exports = List;