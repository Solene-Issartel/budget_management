let models = require('../models');

//GESTION 403 SI EST CONNECTE OU PAS 
function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        let products = [];
        let ctgs = []; //categories
        models.Categorie.findAll().then(categories => {
            
            categories.forEach(cat => {
                ctgs.push(cat);
                id_cat = cat.id_categorie;

                models.Product.findByCategorie(id_cat).then(prods => {
                    
                    prods.forEach(prod => {
                        product = {
                            id: prod.id_product,
                            name: prod.name_product,
                            cat: prod.cat_product
                        }
                        products.push(product);
                    })
                })
            });
        })
        console.log(products)
        res.render("products/products_list", {categories: ctgs, products: products, userAdmin:req.user.isAdmin == 1? true : false});
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

function create_get(req, res){
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        res.render("products/products_create",{ userAdmin:req.user.isAdmin == 1? true : false});
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
        models.Product.delete(id_req,(prod) => {
            const flash = {
                msg:"Vous avez supprimer le produit avec succès",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-success"
            };
            models.setFlash(flash, res);
            res.cookie('token', '', { maxAge: 0, httpOnly: true })
            res.redirect('/products');
    
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
function update_get(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        models.Product.findById(id_req,(product) => {
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            //faire appel à la catégorie
            res.render('products/products_update', 
            { 
                id: product[0].id_product,
                name: product[0].name_product,
                id_cat: product[0].cat_product,
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
function update_post(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        if(req.user.isAdmin==1){
            let q = req.body;
            models.Product.update(q.name_product,q.cat_product,id_req,(product) => {
                const flash = {
                    msg:"Vous avez bien modifié les droits",
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-success"
                };
                models.setFlash(flash, res);
                res.redirect('/products');
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

module.exports = {get, delete_post, update_get, update_post};