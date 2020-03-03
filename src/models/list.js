let co = require('./connection_db');

class List {
    constructor(){
        this.id_list;
        this.total_price_list;
        this.date_list;
        this.id_user;

    }

    static async create(price,id_user) {
        return new Promise( ( resolve, reject ) => {
            let d=new Date();
            console.log(price,d,id_user)

            co.query('INSERT INTO lists (total_price_list,date_list,id_user) VALUES (?,?,?)', [price,d,id_user], ( err, result ) => {
                console.log(result)
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static async delete(id){
        return new Promise( ( resolve, reject ) => {
            co.query('DELETE FROM lists WHERE id_list = ?', [id], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static async  update(id,price,date,id_user){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE lists SET total_price_list = ?, date_list = ?, id_user = ? WHERE id_list = ?', [price,date,id_user,id], ( err, result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static async findById(id){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM lists WHERE id_list = ?', [id], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static async findByUser(id_user){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM lists WHERE id_user = ?', [id_user], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static async findBudgetByUser(id_user){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT total_price_list FROM lists WHERE id_user = ?', [id_user], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static findPricesByMonth(month,id_user,cb){ //month is an int (1:january, 2:feb etc.)
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