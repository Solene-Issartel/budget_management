let co = require('./connection_db');

class Contain {

    constructor(){
        this.id_list;
        this.id_product;
        this.price_product;
    }

    static create(id_l,id_p,price,cb) {
        co.query('INSERT INTO contains SET id_list = ?, id_product = ?, price_product = ?', [id_l,id_p,price], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static delete(id_l,id_p,cb){
        co.query('DELETE FROM contains WHERE id_list = ? AND id_product = ?', [id_l,id_p], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static update(id_l,id_p,price,cb){
        co.query('UPDATE contains SET price_product = ? WHERE id_list = ? AND id_product = ?', [price,id_l,id_p], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static findOne(id_l,id_p,cb){
        co.query('SELECT * FROM contains WHERE id_list = ? AND id_product = ?', [id_l,id_p], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static findByIdList(id_l,cb){
        co.query('SELECT * FROM contains WHERE id_list = ?', [id_l], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static findByIdProduct(id_l,cb){
        co.query('SELECT * FROM contains WHERE id_product = ?', [id_p], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }
}

module.exports = Contain;