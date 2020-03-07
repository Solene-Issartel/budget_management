let models = require('../models');
let services = require('../services');
let bcrypt = require('bcrypt');
let nodemailer = require('nodemailer');


function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        models.User.findAll().then((users)=>{
            let results = services.users.sortUsersByLetter(users,req,res);
            let i=0;
            let list_1=[];
            let list_2=[];
            let list_3=[];
            for(i;i<results.persons.length;i++){
                if(i%3==0){
                    list_1.push(results.persons[i]);
                } else if(i%3==1){
                    list_2.push(results.persons[i]);
                } else {
                    list_3.push(results.persons[i]);
                }
            }
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render("users/users_list", {letters: results.letters, col_1 : list_1,col_2:list_2,col_3:list_3, errors: flash, userAdmin: req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});
            return;
        });
        
    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect(403,'/home');
        return;
    }
    
}

function user_info_get(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(req.user.isAdmin){
            models.User.findById(id_req).then((user) => {
                console.log(user)
                const flash = models.getFlash(req);
                models.destroyFlash(res);
                let isAdmin = user[0].isAdmin==1 ? true : false; //true if the user that we are looking for is an admin
                res.render('users/users_info', {id: id_req,firstname : user[0].firstname, lastname : user[0].lastname, email: user[0].email, isAdmin: isAdmin, errors: flash, userAdmin: req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});
                return;
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
            msg:"Vous devez vous identifer pour faire cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect(401,'/login');
        return;
    }
}

function user_info_post(id_req,req, res) {
    let isAd = req.body.admin == undefined ? 0 : 1;
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(req.user.isAdmin){
            models.User.updateIsAdmin(isAd,id_req).then((user) => {
                const flash = {
                    msg:"Vous avez bien modifié les droits",
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-success"
                };
                models.setFlash(flash, res);
                res.redirect('/users');
                return;
            })
        } else {
            const flash = {
                msg:"Vous n'avez pas les droits pour effectuer cette action.",
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect(403,'/home');
            return;
        }
    } else {
        const flash = {
            msg:"Vous devez vous identifer pour faire cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect(401,'/login');
        return;
    }
}

/**
 * UPDATE user profile (admin cannot update users)
 */
function update_get(req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        models.User.findById(id).then((user) => {
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
                csrfToken: req.csrfToken()
            });
            return;
        })
    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect(403,'/home');
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
        
        //the user want to change his password
        if(q.password){
            
            /**
             * Check if password count 8 characters and verify that password and passwordConfirm are the same
             * 
             */
            if (q.password.length < 8 || q.password != q.passwordConfirm) {
                const flash = {
                    msg:"Le mot de passe n'est pas conforme (taille insuffisante ou les mots de passes ne correspondent pas).",
                    //type : alert-danger {errors}, alert-succes {{success}}
                    alert:"alert-danger"
                };
                models.setFlash(flash, res);
                res.redirect("/profile/update");
                return;
        } else {    
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(q.password, salt, (err, hash) => {
                        if (err) throw err;
                        q.password = hash;
                        models.User.updateWithPassword(id,q.firstname,q.lastname,q.email,q.password).then((user) => {
                            req.user.firstname=q.firstname;
                            const flash = {
                                msg:"Vous avez modifié votre profil avec succès.",
                                //type : alert-danger {errors}, alert-succes {{success}}
                                alert:"alert-success"
                            };
                            models.setFlash(flash, res);
                            res.redirect('/profile/update');
                            return;
                        })
                    });
                });
            }
        //the user doesn't want to change his password
        } else {
            models.User.update(id,q.firstname,q.lastname,q.email).then((user) => {
                req.user.firstname=q.firstname; //marche pas ne met pas a jour le nv nom
                const flash = {
                    msg:"Vous avez modifié votre profil avec succès.",
                    //type : alert-danger {errors}, alert-succes {{success}}
                    alert:"alert-success"
                };
                models.setFlash(flash, res);
                res.redirect('/profile/update');
                return;
            })
        }

    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect(403,'/home');
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
            models.User.delete(id_req).then((user) => {
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
                        return;
                    } else {
                        const flash = {
                            msg:"Compte supprimé avec succès",
                            //type : alert-danger {errors}, alert-success {{success}}
                            alert:"alert-success"
                        };
                        models.setFlash(flash, res);
                        res.redirect('/users');
                        return;
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
                    return;
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
        res.redirect('/home',403);
        return;
    }
}

async function sendMail(){
    let email=req.body.email;
    let text=req.body.text;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user : process.env.GMAIL_USER_EMAIL,
            pass : process.env.GMAIL_USER_PASSWORD,
        },
        tls: {
            rejectUnautorized: false
        }
    })

    let mailOptions = {
        from: email,
        to: process.env.GMAIL_USER_EMAIL,
        subject: "BUDMAN : Nouvelle demande d'un utilisateur",
        text: "<p>"+text+"</p>",
    }

    transporter.sendMail(mailOptions, function(err,info){
        if(err){
            const flash = {
                msg:"Un problème est survenu. Veuillez rééssayer ultérieurement.",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
        } else {
            const flash = {
                msg:"Votre message a été transmis avec succès.",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-success"
            };
            models.setFlash(flash, res);
        }

        res.redirect('/home');
        return;
        
    })
}

module.exports = {get, user_info_post, user_info_get, update_get, update_post, delete_account,sendMail};