let co = require('./connection_db');
let bcrypt = require('bcrypt');
const saltRounds = 10; //means cost factor => controls how much time is needed to calculate a single BCrypt hash

function hashPassword(password) {
    let hash = bcrypt.hashSync(password, saltRounds);
    return hash;
}

class User{
    constructor(){
        this.id_user;
        this.firstname;
        this.lastname;
        this.password;
        this.email;
        this.monthly_budget;
        this.old_budget;
        this.isAdmin;
    }

    static create(firstname, lastname, email, password, isAdmin,cb) {
        isAdmin = isAdmin ? true : false;
        co.query('INSERT INTO users SET firstname = ?, lastname = ?, email = ?, password = ?, isAdmin = ?', [firstname,lastname,email,password,isAdmin], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static delete(id,cb){
        co.query('DELETE FROM users WHERE id_user = ?', [id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static update(id,cb){
        co.query('UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ?, isAdmin = ? WHERE id_user = ?', [firstname,lastname,email,password,isAdmin,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    //trigger before update, insert dans old_budget
    static updateBudget(budget,id,cb){
        co.query('UPDATE users SET monthly_budget = ? WHERE id_user = ?', [budget,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static findOne(email,cb){
        co.query('SELECT * FROM users WHERE email = ?', [email], (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    }

    static findById(id,cb){
        co.query('SELECT * FROM users WHERE id_user = ?', [id], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    }

    static isAdmin(id,cb){
        co.query('SELECT isAdmin FROM users WHERE id_user = ?', [id], (err,result) => {
            if(err) throw err;
            cb(result);
        });
    } 

}

module.exports = User;