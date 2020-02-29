
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

async function setOptionsSelect(){
    let categories = await models.Categorie.findAll();
    return categories;
}

function checkNameRegex(name) {
    let regexNomProd = /^[a-zA-Z0-9áàâäçéèêëîïöùûü._\s-]+$/;
    let error=[];
    /**
     * Check if firstname and username are defined 
     */
    if (name.length == 0 || !regexNomProd.test(name)) {
        error.push("Le nom n'est pas valide (pas de caracteres speciaux).");
    }  

    return error;
}

module.exports = {sortProductsByCategorie, setOptionsSelect, checkNameRegex};
