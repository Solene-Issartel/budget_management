var models = require('../../models');
var bcrypt = require('bcrypt');

function post(req, res) {
    let q = req.body;
    console.log(req.body);
    /**
     * Check if all required attributes are entered
     */
    if (
        q.firstname !== undefined &&
        q.lastname !== undefined &&
        q.email !== undefined &&
        q.password !== undefined &&
        q.passwordConfirm !== undefined
    ) {
        var errors = [];

        /**
         * Check if firstname and username are defined 
         */
        if (q.firstname.length == 0) {
            errors.push("Le prénom ne peut pas être vide.");
        }
        if (q.lastname.length == 0) {
            errors.push("Le nom de famille ne peut pas être vide.");
        }

        /**
         * Check if password count 8 characters and verify that password and passwordConfirm are the same
         * 
         */
        if (q.password.length < 8) {
            errors.push("Le mot de passe doit faire au moins 8 caractères.");
        } else if (q.password != q.passwordConfirm) {
            errors.push("Les deux mots de passes ne sont pas identiques.");
        }

        /**
         * Errors management
         */
        if (errors.length > 0) {
            res.render("auth/register", { name: "S'inscrire", errors });
            return;
        } else {
            models.User.findOne(q.email, function(user){
                if (user.length != 0){
                    res.render("auth/register", { 
                        name: "S'inscrire",  
                        errors: ["Cet email est déjà utilisé."] 
                    });
                    return;
              } else {     
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(q.password, salt, (err, hash) => {
                    if (err) throw err;
                    q.password = hash;
                    models.User.create(q.firstname, q.lastname, q.email, q.password, false, function(err,result){
                        res.redirect("/login");
                    });
                });
              });
            }
        });
    }
    }
}

function get(req, res) {
    res.render('auth/register', { name: "S'inscrire" });
}

module.exports = {post, get};