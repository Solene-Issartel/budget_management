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

    static update(id,name,id_cat){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE products SET name_product = ?, cat_product = ? WHERE id_product = ?', [name,id_cat,id], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static findById(id,cb){
        co.query('SELECT * FROM products WHERE id_product = ?', [id], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static async findAll(){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM products ORDER BY cat_product,name_product', ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static async findByCategorie(id_cat){ //month is an int (1:january, 2:feb etc.)
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM products WHERE cat_product = ? ORDER BY name_product', [id_cat], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
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