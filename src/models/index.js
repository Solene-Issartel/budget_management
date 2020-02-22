var co = require('./connection_db');
var User = require('./user');
var List = require('./list');
var Product = require('./product');
var Contain = require('./contain');
var Categorie = require('./categorie');

async function init() {
    if(process.env.NODE_ENV == "test") {
        await co.drop();
    }

    await co.sync();

    if(process.env.NODE_ENV == "test") {
        try {
           // await User.create("Admin", "Master", "admin", "admin@yopmail.com", true);
        } catch {
            process.exit(1);
        }
    }
}
module.exports = {init, User, List, Product, Categorie,Contain};