let models = require('../models');
let services = require('../services');

//GESTION 403 SI EST CONNECTE OU PAS 
async function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        try {
            const categories = await models.Categorie.findAll();
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render("categories/categories_list", {categories: categories, errors: flash, userAdmin:req.user.isAdmin == 1? true : false, csrfToken: req.csrfToken()});

        } catch (e){
            const flash = {
                msg: e,
                //type : alert-danger {errors}, alert-succes {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/home');
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

async function create_get(req, res){
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        res.render("categories/categories_create",{ userAdmin:req.user.isAdmin == 1? true : false, csrfToken: req.csrfToken(), errors: flash});
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

async function create_post(req, res){
    let isAdmin = req.user.isAdmin;
    let q = req.body;
    console.log(q)
    if(isAdmin){
        let cat = await models.Categorie.findOne(q.name_categorie);
        if(cat.length > 0){
            const flash = {
                msg:"Cette catégorie existe déjà",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/categories/create');
        } else {
            let errors = services.product.checkNameRegex(q.name_categorie);
            if (errors.length > 0){
                const flash = {
                    msg:errors[0],
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-danger"
                };
                models.setFlash(flash, res);
                res.redirect('/categories/create');
            } else { 
                models.Categorie.create(q.name_categorie).then((product) => {
                    const flash = {
                        msg:"Vous avez créé la catégorie avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/categories');
                })
            }
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

function delete_post(id_req,req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        models.Categorie.delete(id_req).then((cat) => {
            const flash = {
                msg:"Vous avez supprimé la catégorie avec succès",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-success"
            };
            models.setFlash(flash, res);
            res.redirect('/categories');
    
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
 * UPDATE product (admin)
 */
async function update_get(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        let cat = await models.Categorie.findById(id_req);
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        //faire appel à la catégorie
        res.render('categories/categories_update', 
        { 
            id_cat: cat[0].id_categorie,
            name: cat[0].name_categorie,
            errors:flash,
            csrfToken: req.csrfToken()
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

/**
 * UPDATE modify profile in database (admin cannot update users)
 */
function update_post(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        if(req.user.isAdmin==1){
            let q = req.body;
            let errors = services.product.checkNameRegex(q.name_categorie);
            
            if(errors.length >0){
                const flash = {
                    msg:errors[0],
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-alert"
                };
                models.setFlash(flash, res);
                res.redirect('/categories/update/'+id_req);

            } else {
                models.Categorie.update(id_req,q.name_categorie).then((cat) => {
                    const flash = {
                        msg:"Vous avez modifié la categorie avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/categories');
                })
            }
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

module.exports = {get, delete_post, create_get,create_post,update_get, update_post};