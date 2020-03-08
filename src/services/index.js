let account = require('./accountService')
let product = require('./productService')
let users = require('./usersService')
let bcrypt = require('bcrypt')

async function init() {

    if(process.env.NODE_ENV == "production") {
        try {
            password="adminBudman";
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (error, hash) => {
                    await User.createSuperUser("Admin", "Master", hash, "budman.assist@gmail.com", true);
                })
            })
        } catch {
            process.exit(1);
        }
    }
}

module.exports = {init, product, account,users};