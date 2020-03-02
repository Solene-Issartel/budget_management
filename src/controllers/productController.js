let models = require('../models');
let services = require('../services');

//GESTION 403 SI EST CONNECTE OU PAS 
async function get(req, res) {
    let isAdmin = req.user.isAdmin;
    if(isAdmin){
        try {

            const products = await models.Product.findAll();
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render("products/products_list", {products: products, layout: "layapp",errors: flash,csrfToken: req.csrfToken(), userAdmin:req.user.isAdmin == 1? true : false});
            

            // const categories = await models.Categorie.findAll();
            // const promises = categories.map((cat) => {
            //     ctgs.push(cat);
            //     id_cat = cat.id_categorie;

            //     return models.Product.findByCategorie(id_cat).then((prods) => {
            //         prods.forEach(prod => {
            //             product = {
            //                 id: prod.id_product,
            //                 name: prod.name_product,
            //                 cat: prod.cat_product
            //             }
            //             products.push(product);
            //         });
            //         return Promise.resolve();
            //     });
            // });

            // Promise.all(promises).then(() => {
                
            //     console.log(products)
            //     console.log(categories)
            //     res.render("products/products_list", {categories: ctgs, products: products, userAdmin:req.user.isAdmin == 1? true : false});

            // });

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
        let categories = await services.product.setOptionsSelect();
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        res.render("products/products_create",{ userAdmin:req.user.isAdmin == 1? true : false, errors: flash, categories: categories,csrfToken: req.csrfToken()});
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
 * UPDATE product (admin)
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
            csrfToken: req.csrfToken(),
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
            let errors = services.product.checkNameRegex(q.name_product);
            if(errors >0){
                const flash = {
                    msg:errors[0],
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-alert"
                };
                models.setFlash(flash, res);
                res.redirect('/products/update/'+id_req);
            } else {
                models.Product.update(id_req,q.name_product,q.cat_product).then((product) => {
                    const flash = {
                        msg:"Vous avez modifié le produit avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect('/products');
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

async function get_all(req,res){
    let prod = await models.Product.findAll();
    res.send(prod);
}

module.exports = {get, get_all,delete_post, create_get,create_post,update_get, update_post};