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

    static update(id,firstname,lastname,email,cb){
        co.query('UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id_user = ?', [firstname,lastname,email,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static updateWithPassword(id,firstname,lastname,email,password,cb){
        co.query('UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id_user = ?', [firstname,lastname,email,password,id], (err,result) => {
            if (err) throw err;
            cb(result) //cb is callback function
        })
    }

    static updateIsAdmin(isAdmin,id,cb){
        co.query('UPDATE users SET isAdmin = ? WHERE id_user = ?', [isAdmin,id], (err,result) => {
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

    static findAll(cb){
        co.query('SELECT * FROM users ORDER BY lastname',(err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    }

    static findById(id,cb){
        co.query('SELECT * FROM users WHERE id_user = ?', [id], (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
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