let models = require('../models');
let services = require('../services');
let bcrypt = require('bcrypt');


function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        models.User.findAll((users)=>{
            let results = services.users.sortUsersByLetter(users,req,res);
            console.log(results);
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render("users/users_list", {letters: results.letters, persons: results.persons, errors: flash, userAdmin: req.user.isAdmin == 1? true : false});
        });
        
    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/home',403);
        return;
    }
    
}

function user_info_get(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(req.user.isAdmin){
            models.User.findById(id_req,(user) => {
                const flash = models.getFlash(req);
                models.destroyFlash(res);
                let isAdmin = user[0].isAdmin==1 ? true : false; //true if the user that we are looking for is an admin
                res.render('users/users_info', {id: id_req,firstname : user[0].firstname, lastname : user[0].lastname, email: user[0].email, isAdmin: isAdmin, errors: flash, userAdmin: req.user.isAdmin == 1? true : false});
            })
        } else {
            const flash = {
                msg:"Vous n'avez pas les droits pour effectuer cette action.",
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/home',403)
        }
    } else {
        return res.status(403).json(err.toString());
    }
}

function user_info_post(id_req,req, res) {
    let isAd = req.body.admin == undefined ? 0 : 1;
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(req.user.isAdmin){
            models.User.updateIsAdmin(isAd,id_req,(user) => {
                const flash = {
                    msg:"Vous avez bien modifié les droits",
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-success"
                };
                models.setFlash(flash, res);
                res.redirect('/users');
            })
        } else {
            const flash = {
                msg:"Vous n'avez pas les droits pour effectuer cette action.",
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/home',403)
        }
    } else {
        return res.status(403).json(err.toString());
    }
}

/**
 * UPDATE user profile (admin cannot update users)
 */
function update_get(req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        models.User.findById(id,(user) => {
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render('users/users_update', 
            { 
                id: id,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                email: user[0].email,
                userAdmin: req.user.isAdmin == 1? true : false,
                errors : flash,
            });
        })
    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/home',403);
        return;
    }
    
}

/**
 * UPDATE modify profile in database (admin cannot update users)
 */
function update_post(req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        let q = req.body;
        var errors = [];
        
        //the user want to change his password
        if(q.password){
            
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
                res.render("users/users_update", {errors: errors, userAdmin: req.user.isAdmin == 1? true : false });
                return;
            } else {    
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(q.password, salt, (err, hash) => {
                        if (err) throw err;
                        q.password = hash;
                        models.User.updateWithPassword(id,q.firstname,q.lastname,q.email,q.password,(user) => {
                            const flash = {
                                msg:"Vous avez modifié votre profil avec succès.",
                                //type : alert-danger {errors}, alert-succes {{success}}
                                alert:"alert-success"
                            };
                            models.setFlash(flash, res);
                            res.redirect('/profile/update');
                        })
                    });
                });
            }
        //the user doesn't want to change his password
        } else {
            models.User.update(id,q.firstname,q.lastname,q.email,(user) => {
                req.user.firstname=q.firstname; //marche pas ne met pas a jour le nv nom
                const flash = {
                    msg:"Vous avez modifié votre profil avec succès.",
                    //type : alert-danger {errors}, alert-succes {{success}}
                    alert:"alert-success"
                };
                models.setFlash(flash, res);
                res.redirect('/profile/update');
            })
        }

    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/home',403);
        return;
    }
}

/**
 * UPDATE user profile (admin cannot update users)
 * from : var to know if the form is from the user (from = true) or delete by an admin (from = undefined)
 */
function delete_account(id_req,from,req, res) {
    let id_user = req.user.id; //recover id from token
    console.log(from)
    if(id_user){
        if(id_user == id_req || req.user.isAdmin){
            models.User.delete(id_req,(user) => {
                if(req.user.isAdmin){
                    if(from){
                        const flash = {
                            msg:"Vous avez supprimer votre comptre avec succès",
                            //type : alert-danger {errors}, alert-success {{success}}
                            alert:"alert-success"
                        };
                        models.setFlash(flash, res);
                        res.cookie('token', '', { maxAge: 0, httpOnly: true })
                        res.redirect('/login');
                    } else {
                        const flash = {
                            msg:"Compte supprimé avec succès",
                            //type : alert-danger {errors}, alert-success {{success}}
                            alert:"alert-success"
                        };
                        models.setFlash(flash, res);
                        res.redirect('/users');
                    }
                } else {
                    const flash = {
                        msg:"Vous avez supprimer votre comptre avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.cookie('token', '', { maxAge: 0, httpOnly: true })
                    res.redirect('/login');
                }
            })
        } else {
            const flash = {
                msg:"Vous n'avez pas les droits pour effectuer cette action.",
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/home',403);
            return;
        }
    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('home',403);
        return;
    }
}


module.exports = {get, user_info_post, user_info_get, update_get, update_post, delete_account};