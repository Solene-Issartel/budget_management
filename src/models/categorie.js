let co = require('./connection_db');

class Categorie {

    constructor(){
        this.id_categorie;
        this.name_categorie;
    }

    static create(name_cat,cb) {
        co.query('INSERT INTO categories SET name_categorie = ?', [name_cat], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static delete(id,cb){
        co.query('DELETE FROM categories WHERE id_categorie = ?', [id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static update(id,name_cat,cb){
        co.query('UPDATE categories SET name_categorie = ? WHERE id_categorie = ?', [name_cat,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static async findName(id){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT id_cat,name_product FROM categories WHERE id_categorie = ?', [id], ( err, result ) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static async findAll(){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM categories', ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static findById(id,cb){
        co.query('SELECT * FROM categories WHERE id_categorie = ?', [id], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }
}

// Categorie.init({
//     name_categorie: {
//         type: sq.STRING,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
// }, {
//     sequelize,
//     timestamps: false,
// });

module.exports = Categorie;