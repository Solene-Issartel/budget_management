let models = require('../models');

//GESTION 403 SI EST CONNECTE OU PAS 
function get(req, res) {
    let id_user = req.user.id;
    if(id_user){
        models.List.findByUser(id_user).then(lists => {
            res.render("lists/lists_list", {lists: lists, userAdmin:req.user.isAdmin == 1? true : false});
        })
    } else {
        const flash = {
            msg:"Vous devez vous identifier pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/login',401);
        return;
    }
}

function list_info_get(req, res) {
    let id_user = req.user.id;
    if(id_user){
        models.List.findByUser(id_user).then(lists => {
            res.render("lists/lists_list", {lists: lists, userAdmin:req.user.isAdmin == 1? true : false});
        })
    } else {
        const flash = {
            msg:"Vous devez vous identifier pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/login',401);
        return;
    }
}

function create_get(req, res){
    let id_user = req.user.id;
    if(id_user){
        res.render("lists/lists_create",{ userAdmin:req.user.isAdmin == 1? true : false});
    } else {
        const flash = {
            msg:"Vous devez vous identifier pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/login',401);
        return;
    }
}

function create_post(req, res){
    let id_user = req.user.id;
    if(id_user){
        let q = req.body;
        res.render("products/products_create",{ userAdmin:req.user.isAdmin == 1? true : false});
    } else {
        const flash = {
            msg:"Vous devez vous identifier pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/login',401);
        return;
    }
}

function delete_post(id_req,req, res){
    let id_user = req.user.id;
    if(id_user){
        models.List.findById(id_req).then((list)=>{
            if(id_user==list.id_user){ 
                models.List.delete(id_req).then(()=>{
                    const flash = {
                        msg:"Vous avez supprimer la liste avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect("/lists");
                })
            } else {
                const flash = {
                    msg:"Vous n'avez pas les droits pour effectuer cette action.",
                    //type : alert-danger {errors}, alert-succes {{success}}
                    alert:"alert-danger"
                };
                models.setFlash(flash, res);
                res.redirect('home',403);
                return;
            }
        })
    } else {
        const flash = {
            msg:"Vous devez vous identifier pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/login',401);
        return;
    }
}

/**
 * UPDATE product (admin)
 */
function update_get(id_req,req, res) {
    let id = req.user.id; //recover id from token
    if(id){
        models.List.findById(id_req).then((list)=>{
            if(id_user==list.id_user){ 
                let q = req.body;
                models.List.update(id_req).then(()=>{
                    const flash = {
                        msg:"Vous avez mofifier la liste avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect("/lists");
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
        })
    } else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/login',401);
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

module.exports = {get, list_info_get, create_get, create_post, delete_post, update_get, update_post};