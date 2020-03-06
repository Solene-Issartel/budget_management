let co = require('./connection_db');
let bcrypt = require('bcrypt');
const saltRounds = 10; //means cost factor => controls how much time is needed to calculate a single BCrypt hash

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

    static create(firstname, lastname, email, password, isAdmin) {
        return new Promise( ( resolve, reject ) => {
            isAdmin = isAdmin ? true : false;
            co.query('INSERT INTO users SET firstname = ?, lastname = ?, email = ?, password = ?, isAdmin = ?', [firstname,lastname,email,password,isAdmin], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static delete(id){
        return new Promise( ( resolve, reject ) => {
            co.query('DELETE FROM users WHERE id_user = ?', [id], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static update(id,firstname,lastname,email){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id_user = ?', [firstname,lastname,email,id], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static updateWithPassword(id,firstname,lastname,email,password){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id_user = ?', [firstname,lastname,email,password,id], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static updateIsAdmin(isAdmin,id){
        return new Promise( ( resolve, reject ) => {
            co.query('UPDATE users SET isAdmin = ? WHERE id_user = ?', [isAdmin,id], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static findOne(email){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM users WHERE email = ?', [email], (err,rows) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static findAll(){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM users ORDER BY lastname', (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
    }

    static findById(id){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT * FROM users WHERE id_user = ?', [id], (err,rows) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    static isAdmin(id){
        return new Promise( ( resolve, reject ) => {
            co.query('SELECT isAdmin FROM users WHERE id_user = ?', [id], (err,result) => {
                if ( err )
                    return reject( err );
                resolve( result );
            } );
        } );
        
    } 

}

module.exports = User;