let jwt = require('jsonwebtoken');
let SECRET_KEY="aNdRgUjX"; //random key
let jwtExpirySeconds = 3600;
let models = require('../../models');
let bcrypt = require ('bcrypt'); 

function home(req, res) {
    let token = req.cookies.token;
    const flash = models.getFlash(req);
    models.destroyFlash(res);
    res.render('home', {
        firstname: req.user.firstname,
        errors: flash,
        userAdmin: req.user.isAdmin == 1? true : false,
        csrfToken: req.csrfToken()
    });
}

function get(req, res) {
    const flash = models.getFlash(req);
    models.destroyFlash(res);
    res.render('auth/login',{layout: 'layhome',errors : flash,csrfToken: req.csrfToken()})
}

// Login
function post(req, res, next) {
    let q = req.body;

    let email = q.email;
    let password = q.password;

    models.User.findOne(email, function(user){
        
        if (user.length != 0){
            bcrypt.compare(password, user[0].password, function(err, result) {
                if(result){
                    let id = user[0].id_user;
                    let firstname = user[0].firstname;
                    let isAdmin = user[0].isAdmin == 1 ? true : false;
                    
                    const token = jwt.sign({id,firstname,email,isAdmin},SECRET_KEY, {
                        algorithm: 'HS256',
                    });
                    res.cookie('token', token, { maxAge: (jwtExpirySeconds*2)*1000});
                    res.redirect("/home");
                } else {
                    const flash = {
                        msg:"Mauvais email ou mot de passe.",
                        //type : alert-danger {errors}, alert-succes {{success}}
                        alert:"alert-danger"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/login');
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
        const decrypt = jwt.verify(token, SECRET_KEY);
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

module.exports = {home,post, get, verifyToken, SECRET_KEY};