let models = require('../models');
let bcrypt = require('bcrypt');

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
        req.user.errors = "Vous n'avez pas les droits pour effectuer cette action."
        res.redirect('/home',403);
        return;
    }
    
}

module.exports = {get};