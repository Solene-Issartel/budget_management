var co = require('./connection_db');
var User = require('./user');
var List = require('./list');
var Product = require('./product');
var Contain = require('./contain');
var Categorie = require('./categorie');

async function init() {
    if(process.env.NODE_ENV != "production") {
        await co.drop();
    }

    await co.sync();

    if(process.env.NODE_ENV != "production") {
        try {
           // await User.create("Admin", "Master", "admin", "admin@yopmail.com", true);
        } catch {
            process.exit(1);
        }
    }
}

function setFlash  (flash,res){
    return res.cookie('flash',flash,{ maxAge:1000*600, httpOnly: true })
}

function getFlash (req){
    return req.cookies['flash'];
}

function destroyFlash (res){
    return res.clearCookie('flash');

}

module.exports = {init, User, List, Product, Categorie,Contain, setFlash, getFlash, destroyFlash};