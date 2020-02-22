let co = require('./connection_db');

class Product {

    constructor(){
        this.id_product;
        this.name_product;
        this.cat_product;
    }

    static create(name,id_cat,cb) {
        co.query('INSERT INTO products SET name_product = ? AND cat_product = ?', [name,id_cat], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static delete(id,cb){
        co.query('DELETE FROM products WHERE id_product = ?', [id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static update(id,name,id_cat,cb){
        co.query('UPDATE products SET name_product = ?, cat_product = ? WHERE id_product = ?', [price,date,id_user,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static findById(id,cb){
        co.query('SELECT * FROM products WHERE id_product = ?', [id], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static findByUser(id_user,cb){
        co.query('SELECT * FROM products WHERE id_user = ?', [id_user], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static findByCategorie(id_cat,cb){ //month is an int (1:january, 2:feb etc.)
        co.query('SELECT * FROM products WHERE cat_product = ?', [id_cat], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }
}

// Product.init({
//     name_product: {
//         type: sq.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
//     price_product: {
//         type: sq.FLOAT,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
//     price_kg: {
//         type: sq.BOOLEAN,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
//     cat_product: {
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

module.exports = Product;