let account = require('./accountService')
let product = require('./productService')
let users = require('./usersService')

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

module.exports = {init, product, account,users};