
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

function checkRegisterRegex(req,res) {
    let q = req.body;
    var errors = [];
    let regexMail = /[a-zA-Z0-9._-]+@[a-zA-Z\.]+\.[a-z]{1,5}$/;
    let regexPrenomNom = /^[a-zA-Z0-9áàâäçéèêëîïöùûü._\s-]+$/;

    /**
     * Check if firstname and username are defined 
     */
    if (q.firstname.length == 0 || !regexPrenomNom.test(q.firstname)) {
        errors.push("Le prénom n'est pas valide (pas de caracteres speciaux).");
    }
    if (q.lastname.length == 0 || !regexPrenomNom.test(q.lastname)) {
        errors.push("Le nom de famille n'est pas valide (pas de caracteres speciaux)");
    }

    /**
     * Check if email have wrong characters defined 
     */       
    if (q.email.length == 0 || !regexMail.test(q.email)) {
        errors.push("L'email n'est pas valide (pas de caracteres speciaux).");
    }

    /**
     * Check if password count 8 characters and verify that password and passwordConfirm are the same
     * 
     */
    if (q.password.length < 8) {
        errors.push("Le mot de passe doit faire au moins 8 caractères.");
    } else if (q.password != q.passwordConfirm) {
        errors.push("Les deux mots de passes ne sont pas identiques.");
    }

    return errors;
}

module.exports = {sortProductsByCategorie, setOptionsSelect};
