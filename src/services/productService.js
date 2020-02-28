
let models = require('../models');

async function sortProductsByCategorie(req,res){
    const categories = await models.Categorie.findAll();
        const promises = categories.map((cat) => {
            ctgs.push(cat);
            id_cat = cat.id_categorie;

            return models.Product.findByCategorie(id_cat).then((prods) => {
                prods.forEach(prod => {
                    product = {
                        id: prod.id_product,
                        name: prod.name_product,
                        cat: prod.cat_product
                    }
                    products.push(product);
                });
                return Promise.resolve();
            });
        });
}

module.exports = {sortProductsByCategorie};
