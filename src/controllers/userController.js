let models = require('../models');
let bcrypt = require('bcrypt');

function post(req, res) {
    let q = req.body;
    
}

function user_info_post(id_req,req, res) {
    let isAd = req.body.admin == undefined ? 0 : 1;
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(req.user.isAdmin){
            models.User.updateIsAdmin(isAd,id_req,(user) => {
                req.user.errors='Vous avez bien modifié les droits';
                
                res.redirect('/users');
            })
        } else {
            res.render('home', {errors:"Vous n'avez pas les droits pour effectuer cette action."})
        }
    } else {
        return res.status(403).json(err.toString());
    }
}

function user_info_get(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(req.user.isAdmin){
            models.User.findById(id_req,(user) => {
                let isAdmin = user[0].isAdmin==1 ? true : false;
                res.render('users/users_info', {id: id_req,firstname : user[0].firstname, lastname : user[0].lastname, email: user[0].email, isAdmin: isAdmin});
            })
        } else {
            res.render('home', {errors:"Vous n'avez pas les droits pour effectuer cette action."})
        }
    } else {
        return res.status(403).json(err.toString());
    }
}

function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        models.User.findAll((users)=>{
            let letters = [];
            let persons = [];
            users.forEach(user => {
                if(req.user.id != user.id_user){ //current user cannot see him-self
                    let letter = user.lastname.charAt(0).toUpperCase();
                    let alreadyIn = letters.includes(letter); 
                    if(!alreadyIn){
                        letters.push(letter);
                    }
                    var person = {
                        letter: letter,
                        id: user.id_user,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        isAdmin: user.isAdmin 
                    }
                    persons.push(person);
                }
            });
            res.render("users/users_list", {letters: letters, persons: persons, errors: req.user.errors});
        })
    } else {
        res.redirect('home',403);
        return;
    }
    
}

/**
 * UPDATE user profile (admin cannot update users)
 */
function update_get(req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        models.User.findById(id,(user) => {
            res.render('users/users_update', 
            { 
                name: "Modification du profil", 
                id: id,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                email: user[0].email
            });
        })
    } else {
        return res.status(403).json(err.toString());
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
                res.render("users/users_update", { name: "Modification de son profil", errors });
                return;
            } else {    
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(q.password, salt, (err, hash) => {
                        if (err) throw err;
                        q.password = hash;
                        models.User.updateWithPassword(id,q.firstname,q.lastname,q.email,q.password,(user) => {
                            res.render('index');
                        })
                    });
                });
            }
        //the user doesn't want to change his password
        } else {
            models.User.update(id,q.firstname,q.lastname,q.email,(user) => {
                req.user.firstname=q.firstname;
                res.render('home', {firstname: req.user.firstname});
            })
        }

    } else {
        return res.status(403).json(err.toString());
    }
}

/**
 * UPDATE user profile (admin cannot update users)
 */
function delete_account(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(id_user == id_req || req.user.isAdmin){
            models.User.delete(id_req,(user) => {
                if(req.user.isAdmin){
                    req.user.errors = 'Compte supprimé avec succès'
                    res.redirect('/users');
                } else {
                    req.user = {};
                    req.cookies.token = null;
                    res.redirect('/login');
                }
            })
        } else {
            res.render('home', {errors:"Vous n'avez pas les droits pour effectuer cette action."})
        }
    } else {
        return res.status(403).json(err.toString());
    }
}

/**
 * UPDATE user profile (admin cannot update users)
 */
function delete_user(req, res) {
    let id_req = req.params.id;
    let id_user = req.user.id; //recover id from token
    if(id_user){
        if(id_user !== id_req){
            models.User.delete(id,(user) => {
                req.user = {};
                req.cookies.token = null;
                res.redirect('/login');
            })
        } else {
            res.render('home', {errors:"Vous n'avez pas les droits pour effectuer cette action."})
        }
    } else {
        return res.status(403).json(err.toString());
    }
    
}

module.exports = {post, get, user_info_post, user_info_get, update_get, update_post, delete_account, delete_user};