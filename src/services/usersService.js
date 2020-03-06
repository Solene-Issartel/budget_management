
let models = require('../models');
let nodemailer = require('nodemailer');
let env = require('../env');
let safe = require('safe-regex');

function sortUsersByLetter(users,req,res){
    
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

    const results= {
        letters:letters,
        persons:persons
    }

    return results;
}


function sendMail(req,res){
    let email=req.body.email;
    let text=req.body.text;
    if(checkMailRegex(email,req,res)!=undefined){
        const flash = {
            msg:checkMailRegex(email),
            //type : alert-danger {errors}, alert-success {{success}}
            alert:"alert-warning"
        };
        models.setFlash(flash, res);
        res.redirect('/home#contact');
        return;
    } else if (text.length==0){
        const flash = {
            msg:"Votre message ne peut pas être vide.",
            //type : alert-danger {errors}, alert-success {{success}}
            alert:"alert-warning"
        };
        models.setFlash(flash, res);
        res.redirect('/home#contact');
        return
    } else {
        let transporter;
        if(process.env.NODE_ENV == "production"){
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user : process.env.GMAIL_USER_EMAIL,
                    pass : prcess.env.GMAIL_USER_PASSWORD, 
                },
                tls: {
                    rejectUnautorized: false
                }
            })
        } else {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user : env.GMAIL_USER_EMAIL,
                    pass : env.GMAIL_USER_PASSWORD,
                },
                tls: {
                    rejectUnautorized: false
                }
            })
        }

        let mailOptions = {
            to: env.GMAIL_USER_EMAIL,
            subject: "BUDMAN : Nouvelle demande d'un utilisateur",
            html: "<b>Expéditeur : <a href='mailto:"+email+"'>"+email+"</a></b><p>"+text+"</p>"
        }
    
        transporter.sendMail(mailOptions, function(err,info){
            if(err){
                const flash = {
                    msg:"Un problème est survenu. Veuillez rééssayer ultérieurement.",
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-danger"
                };
                models.setFlash(flash, res);
                res.redirect('/home#contact');
                return
            } else {
                const flash = {
                    msg:"Votre message a été transmis avec succès.",
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-success"
                };
                models.setFlash(flash, res);
                res.redirect('/home#contact');
                return
            }
        })
    }
}

/**
 * Checks if email input is valid
 * 
 *  */
function checkMailRegex(email,req,res) {
    let regexMail = /^[a-zA-Z0-9._-]+@[a-zA-Z\.]+\.[a-z]{1,5}$/;
    
    if(!safe(regexMail)){
        const flash = {
            msg:"Alerte sécurité sur le site. Veuillez contacter un administrateur",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/logout');
        return;
    }else {
        /**
         * Check if firstname and username are defined 
         */
        if (email.length == 0 || !regexMail.test(email)) {
            return "Mail invalide (pas de caractères spéciaux).";
        }
    }
}

module.exports = {sortUsersByLetter,sendMail,checkMailRegex};