let jwt = require('jsonwebtoken');
let SECRET_KEY="aNdRgUjX"; //random key
let jwtExpirySeconds = 300;
let models = require('../../models');
let bcrypt = require ('bcrypt'); 

function get(req, res) {
    res.render('auth/login', { 
        name: "Se connecter", 
        successes: req.query.fromRegister !== undefined ? ["Vous êtes inscrit. Vous pouvez maintenant vous connecter."] : [],
        errors: req.query.error !== undefined ? ["Mauvaise combinaison email/mot de passe. Ré-essayez."] : [],
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
                    const token = jwt.sign({id,firstname,email},SECRET_KEY, {
                        algorithm: 'HS256',
                    });
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
                    res.end();
                }
            });
            return;
        } else {     
            res.redirect("/");   
        }
    })
}

//Verify token
function verifyToken(req, res, next){
    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.status(401).json('You need to Login')
        }
        const decrypt = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: decrypt.id,
            firstname: decrypt.firstname,
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
}

module.exports = {post, get, verifyToken, SECRET_KEY};