let models = require('../models');

//GESTION 403 SI EST CONNECTE OU PAS 
function get(req, res) {
    let id_user = req.user.id;
    if(id_user){
        models.List.findByUser(id_user).then(li => {
            const lists = li.map(x => {
                return {
                    id_list : x.id_list,
                    date_list: x.date_list.getDate()+"/"+(x.date_list.getMonth()+1)+"/"+x.date_list.getFullYear()
                }
            })
            console.log(lists)
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

async function create_get(req, res){
    let id_user = req.user.id;
    if(id_user){
        let prod_list = await models.Contain.findForLastMonth(id_user);
        let products = prod_list.map(async element => {
            return await models.Product.findById(element.id_product)
        });
       
        Promise.all(products).then(()=>{
            console.log(products)
            res.render("lists/lists_create",{products:products,userAdmin:req.user.isAdmin == 1? true : false});
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

async function create_post(req, res){
    let id_user = req.user.id;
    if(id_user){
        let q = req.body;
        let i=0;
        let total=0;
        for(i=0;i<q.prices.length;i++){
            total+=parseInt(q.prices[i]);
        }
        let today=new Date();
        const newList = await models.List.create(total,today,id_user);
        for(i=0;i<q.prices.length;i++){
            await models.Contain.create(newList.id_list,parseInt(q.ids[i]),parseInt(q.prices[i]))
        }

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
            console.log(list)
            if(id_user==list[0].id_user){ 
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
async function update_get(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    if(id_user){
        models.List.findById(id_req).then(async (list)=>{
            if(id_user==list[0].id_user){ 
                let prod_list = await models.Contain.findForLastMonth(id_user);
                let products = prod_list.map(async element => {
                    return await models.Product.findById(element.id_product)
                });

                let old_prod = await models.Contain.findByIdList(id_req);
            
                Promise.all(products).then(()=>{
                    console.log(products)
                    console.log(old_prod)
                    res.render("lists/lists_create",{products:products,old_prod:old_prod,userAdmin:req.user.isAdmin == 1? true : false});
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

async function graphs_get(req,res){
    let id_user=req.user.id;
    if(id_user){
        let budgets = await models.List.findBudgetByUser(id_user);
        res.send(budgets);
    }
    else {
        const flash = {
            msg:"Vous n'avez pas les droits pour effectuer cette action.",
            //type : alert-danger {errors}, alert-succes {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect('/home',403)
    }
}

module.exports = {get, list_info_get, create_get, create_post, delete_post, update_get, update_post,graphs_get};