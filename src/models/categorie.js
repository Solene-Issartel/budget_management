let co = require('./connection_db');

class Categorie {

    constructor(){
        this.id_categorie;
        this.name_categorie;
    }

    static async create(name_cat) {
        return new Promise( ( resolve, reject ) => {
            co.query('INSERT INTO categories SET name_categorie = ?', [name_cat], ( err, result ) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static async delete(id){
        return new Promise( ( resolve, reject ) => {
            co.query('DELETE FROM categories WHERE id_categorie = ?', [id], ( err, result ) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static async update(id,name_cat){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE categories SET name_categorie = ? WHERE id_categorie = ?', [name_cat,id], ( err, result ) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
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

    static async findOne(name){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM categories WHERE name_categorie = ?', [name], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
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

    static async findById(id){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM categories WHERE id_categorie = ?', [id], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
        
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