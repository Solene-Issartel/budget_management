let co = require('./connection_db');

class Contain {

    constructor(){
        this.id_list;
        this.id_product;
        this.price_product;
    }

    static async create(id_l,id_p,price) {
        return new Promise( ( resolve, reject ) => {
            co.query('INSERT INTO contains SET id_list = ?, id_product = ?, price_product = ?', [id_l,id_p,price], ( err, result ) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static delete(id_l,id_p,cb){
        co.query('DELETE FROM contains WHERE id_list = ? AND id_product = ?', [id_l,id_p], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static async update(id_l,id_p,price){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE contains SET price_product = ? WHERE id_list = ? AND id_product = ?', [price,id_l,id_p], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
        
    }

    static findOne(id_l,id_p){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM contains WHERE id_list = ? AND id_product = ?', [id_l,id_p], (err,rows) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static findByIdList(id_l){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT lists.id_list, lists.date_list,contains.price_product, products.name_product, products.id_product FROM contains INNER JOIN lists ON lists.id_list=contains.id_list INNER JOIN products ON products.id_product=contains.id_product WHERE contains.id_list=?', [id_l], ( err, result ) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static findByIdProduct(id_l,cb){
        co.query('SELECT * FROM contains WHERE id_product = ?', [id_p], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static async findForLastMonth(id_user){
        return new Promise( ( resolve, reject ) => {
            let today=new Date();
            let m = today.getMonth();
            let y = today.getFullYear();
            let end_date=y+"-"+m+"-"+31;
            
            m = today.getMonth()-3;
            if(m<=0){
                m=12+m
                y=y-1
            }
            let start_date=y+"-"+m+"-"+1;
            co.query('SELECT * FROM contains WHERE id_list IN (SELECT id_list FROM lists WHERE id_user= ? AND date_list >= ? AND date_list <= ?) GROUP BY id_product HAVING COUNT(*)>=2', [id_user,start_date,end_date], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
}

module.exports = Contain;