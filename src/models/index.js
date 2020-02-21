var co = require('./connection_db');
var User = require('./user');

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
module.exports = {init, User};