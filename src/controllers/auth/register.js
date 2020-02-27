var models = require('../../models');
var bcrypt = require('bcrypt');
let services = require('../../services');

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

        let errors = services.account.checkRegisterRegex(req,res);

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
                        const flash = {
                            msg:"Compte créé avec succès. Vous pouvez désormais vous connecter.",
                            //type : alert-danger {errors}, alert-succes {{success}}
                            alert:"alert-success"
                        };
                        models.setFlash(flash, res);
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