
// let models = require('../models');

// function sortProductsByCategorie(req,res){
//     let products = [];
//     let ctgs = []; //categories
//     models.Categorie.findAll().then(categories => {
        
//         categories.forEach(cat => {
//             ctgs.push(cat);
//             id_cat = cat.id_categorie;

//             models.Product.findByCategorie(id_cat).then(prods => {
                
//                 prods.forEach(prod => {
//                     product = {
//                         id: prod.id_product,
//                         name: prod.name_product,
//                         cat: prod.cat_product
//                     }
//                     products.push(product);
//                 })
//             })
//         });
//     })
// }

// module.exports = {sortProductsByCategorie};
