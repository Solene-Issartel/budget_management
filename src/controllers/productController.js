let models = require('../models');
let services = require('../services');

/**
 * Give the product list (only for admins)
 */ 
async function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        // try {

            const products = await models.Product.findAll();
            let i =0;
            let prodByCat = [];
            let last_index = 0;
            for(i;i<products.length;i++){
                if(products[i+1]){
                    if(products[i].cat_product!=products[i+1].cat_product){
                        prodByCat.push(products.slice(last_index,i+1));
                        last_index=i+1;
                    }
                } else {
                    prodByCat.push(products.slice(last_index,i+1));
                }
            }

            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render("products/products_list", {products: prodByCat, layout: "layapp",errors: flash,csrfToken: req.csrfToken(), userAdmin:req.user.isAdmin == 1? true : false, title : "Tous les produits"});
        
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
 * Returns the page for create a new product
 */
async function create_get(req, res){
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        let categories = await services.product.setOptionsSelect();
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        res.render("products/products_create",{ userAdmin:req.user.isAdmin == 1? true : false, errors: flash, categories: categories,csrfToken: req.csrfToken(),title : "Créer un produit"});
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
 * CREATE a new product (only for admins)
 */
async function create_post(req, res){
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        let q = req.body;
        let prod = await models.Product.findOne(q.name_product);
        if(prod.length > 0){
            const flash = {
                msg:"Ce produit existe déjà",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect('/products/create');
        } else {
            let errors = services.product.checkNameRegex(q.name_product);
            if (errors.length > 0){
                const flash = {
                    msg:errors[0],
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-danger"
                };
                models.setFlash(flash, res);
                res.redirect('/products/create');
            } else { 
                models.Product.create(q.name_product,q.cat_product).then((product) => {
                    const flash = {
                        msg:"Vous avez créé le produit avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/products');
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

/**
 * DELETE the given product (only for admins)
 */
function delete_post(id_req,req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        models.Product.delete(id_req).then((prod) => {
            const flash = {
                msg:"Vous avez supprimé le produit avec succès",
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
        res.redirect('/home',403);
        return;
    }
    
}

/**
 * UPDATE product (only for admins)
 */
async function update_get(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        let product = await models.Product.findById(id_req);
        let categories = await services.product.setOptionsSelect();
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        //faire appel à la catégorie
        res.render('products/products_update', 
        { 
            id: product[0].id_product,
            name: product[0].name_product,
            id_cat: product[0].cat_product,
            categories:categories,
            errors:flash,
            userAdmin:req.user.isAdmin == 1? true : false,
            csrfToken: req.csrfToken(),
            title : "Modifier un produit"
        });
        return;
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
 * UPDATE the given product (only for admins)
 */
function update_post(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        if(req.user.isAdmin==1){
            let q = req.body;
            let errors = services.product.checkNameRegex(q.name_product);
            if(errors >0){
                const flash = {
                    msg:errors[0],
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-alert"
                };
                models.setFlash(flash, res);
                res.redirect('/products/update/'+id_req);
                return;
            } else {
                models.Product.update(id_req,q.name_product,q.cat_product).then((product) => {
                    const flash = {
                        msg:"Vous avez modifié le produit avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/products');
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
            res.redirect('/home',403);
            return;
        }
    } else {
        return res.status(403).json(err.toString());
    }
}

/**
 * Send all the products from the database
 */
async function get_all(req,res){
    let prod = await models.Product.findAll();
    res.send(prod);
    return;
}

module.exports = {get, get_all,delete_post, create_get,create_post,update_get, update_post};