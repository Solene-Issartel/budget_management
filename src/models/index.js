let co = require('./connection_db');
let User = require('./user');
let List = require('./list');
let Product = require('./product');
let Contain = require('./contain');
let Categorie = require('./categorie');

function setFlash  (flash,res){
    return res.cookie('flash',flash,{ maxAge:1000*600, httpOnly: true })
}

function getFlash (req){
    return req.cookies['flash'];
}

function destroyFlash (res){
    return res.clearCookie('flash');

}

module.exports = {User, List, Product, Categorie,Contain, setFlash, getFlash, destroyFlash};