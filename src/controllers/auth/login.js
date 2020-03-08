let jwt = require('jsonwebtoken');
let JWT_SECRET_KEY="";
if(process.env.NODE_ENV == "production"){
    JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
} else {
    let env= require('../../env');
    JWT_SECRET_KEY=env.JWT_SECRET_KEY 
}
let jwtExpirySeconds = 3600;
let models = require('../../models');
let bcrypt = require ('bcrypt'); 

/**
 * Returns the connected users home page
 */
function home(req, res) {
    const flash = models.getFlash(req);
    models.destroyFlash(res);
    res.render('home', {
        firstname: req.user.firstname,
        errors: flash,
        userAdmin: req.user.isAdmin == 1? true : false,
        csrfToken: req.csrfToken(),
        title : "Page d'accueil"
    });
    return
}

/**
 * Returns the login page
 */
function get(req, res) {
    const flash = models.getFlash(req);
    models.destroyFlash(res);
    res.render('auth/login',{layout: 'layhome',errors : flash,csrfToken: req.csrfToken(),title : "Connexion"})
    return
}

// Login user
function post(req, res, next) {
    let q = req.body;

    let email = q.email;
    let password = q.password;

    models.User.findOne(email).then(function(user){
        
        if (user.length != 0){
            bcrypt.compare(password, user[0].password, function(err, result) {
                if(result){
                    let id = user[0].id_user;
                    let firstname = user[0].firstname;
                    let isAdmin = user[0].isAdmin == 1 ? true : false;
                    
                    const token = jwt.sign({id,firstname,email,isAdmin},JWT_SECRET_KEY, {
                        algorithm: 'HS256',
                    });
                    res.cookie('token', token, { maxAge: (jwtExpirySeconds*2)*1000, httpOnly : true, secure : true});
                    res.redirect("/home");
                    return
                } else {
                    const flash = {
                        msg:"Mauvais email ou mot de passe.",
                        //type : alert-danger {errors}, alert-succes {{success}}
                        alert:"alert-danger"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/login');
                    return
                }
            });
            return;
        } else {     
            const flash = {
                msg:"Mauvais email ou mot de passe.",
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/login');   
            return
        }
    })
}


//Verify token
function verifyToken(req, res, next){
    const token = req.cookies.token || '';
    
    try {
        if (!token) {
            const flash = {
                msg:"Vous devez vous identifier.",
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/login',401);   
        }
        const decrypt = jwt.verify(token, JWT_SECRET_KEY);
        req.user = {
            id: decrypt.id,
            firstname: decrypt.firstname,
            isAdmin: decrypt.isAdmin,
            userAdmin: decrypt.isAdmin,
            errors : []
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
}

module.exports = {home,post, get, verifyToken};