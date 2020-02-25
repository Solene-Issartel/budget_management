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
        let regexMail = /[a-zA-Z0-9._-]+@[a-zA-Z\.]+\.[a-z]{1,5}$/;
        let regexPrenomNom = /^[a-zA-Z0-9áàâäçéèêëîïöùûü._\s-]+$/;

        /**
         * Check if firstname and username are defined 
         */
        if (q.firstname.length == 0 || !regexPrenomNom.test(q.firstname)) {
            errors.push("Le prénom n'est pas valide (pas de caracteres speciaux).");
        }
        if (q.lastname.length == 0 || !regexPrenomNom.test(q.lastname)) {
            errors.push("Le nom de famille n'est pas valide (pas de caracteres speciaux)");
        }

        /**
         * Check if email have wrong characters defined 
         */       
        if (q.email.length == 0 || !regexMail.test(q.email)) {
            errors.push("L'email n'est pas valide (pas de caracteres speciaux).");
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
            res.render("auth/register", {
                errors: errors,
                layout: 'layhome' 
            });
            return;
        } else {
            models.User.findOne(q.email, function(user){
                if (user.length != 0){
                    const flash = {
                        msg:"Cet email est déjà utilisé.",
                        //type : alert-danger {errors}, alert-succes {{success}}
                        //alert:"alert-danger"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/register'); 
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
    const flash = models.getFlash(req);
    models.destroyFlash(res);
    console.log(flash)
    res.render('auth/register', {layout: 'layhome',errors: flash });
}

module.exports = {post, get};