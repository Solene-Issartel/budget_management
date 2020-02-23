let jwt = require('jsonwebtoken');
let SECRET_KEY="aNdRgUjX"; //random key
let jwtExpirySeconds = 300;
let models = require('../../models');
let bcrypt = require ('bcrypt'); 

function home(req, res) {
    res.render('home', { 
        name: "Accueil", 
        firstname: req.user.firstname,
    });
}

function get(req, res) {
    res.render('auth/login', { 
        name: "Se connecter"
    });
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
                    let isAdmin = user[0].isAdmin;
                    if(isAdmin == 0){
                        isAdmin = false;
                    } else {
                        isAdmin = true;
                    }
                    const token = jwt.sign({id,firstname,email,isAdmin},SECRET_KEY, {
                        algorithm: 'HS256',
                    });
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
                    res.redirect("/home");
                }
            });
            return;
        } else {     
            res.render("auth/login", { 
                name: "Se connecter",  
                errors: ["Mauvais email ou mot de passe."] 
            });
            return;   
        }
    })
}

//Verify token
function verifyToken(req, res, next){
    const token = req.cookies.token || '';
    
    try {
        if (!token) {
            return res.render("auth/login", {errors: 'Vous devez vous identifier.'});  
        }
        const decrypt = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: decrypt.id,
            firstname: decrypt.firstname,
            isAdmin: decrypt.isAdmin
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
}

module.exports = {home,post, get, verifyToken, SECRET_KEY};