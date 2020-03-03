let models = require('../models');

//GESTION 403 SI EST CONNECTE OU PAS 
function get(req, res) {
    let id_user = req.user.id;
    models.List.findByUser(id_user).then(li => {
        const lists = li.map(x => {
            return {
                id_list : x.id_list,
                date_list: x.date_list.getDate()+"/"+(x.date_list.getMonth()+1)+"/"+x.date_list.getFullYear()
            }
        })
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        res.render("lists/lists_list", {lists: lists, errors:flash, userAdmin:req.user.isAdmin == 1? true : false, csrfToken: req.csrfToken()});
    })
}

function list_info_get(req, res) {
    let id_user = req.user.id;
    models.List.findByUser(id_user).then(lists => {
        res.render("lists/lists_list", {lists: lists, userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});
    })
}

async function create_get(req, res){
    let id_user = req.user.id;
    let products=[];
    let prod_list = await models.Contain.findForLastMonth(id_user);
    const promises = prod_list.map((prod) => {
    
        return models.Product.findById(prod.id_product).then((prods) => {
            prods.forEach(prod => {
                products.push(prod);
            });
            return Promise.resolve();
            });
        });

        Promise.all(promises).then(() => {
            res.render("lists/lists_create", {prod_list: prod_list,products:products, userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});

        });
        
}

async function create_post(req, res){
    let id_user = req.user.id;
    
    let q = req.body;
    let i=0;
    let total=0;
    console.log(q.prices)
    for(i=0;i<q.prices.length;i++){
        total+=parseFloat(q.prices[i]);
    }
    const newList = await models.List.create(total,id_user);
    for(i=0;i<q.prices.length;i++){
        await models.Contain.create(newList.insertId,parseInt(q.ids[i]),parseFloat(q.prices[i]))
    }

    const flash = {
        msg:"Vous avez créé la liste avec succès",
        //type : alert-danger {errors}, alert-success {{success}}
        alert:"alert-success"
    };
    models.setFlash(flash, res);
    res.redirect("/lists");
    
}

function delete_post(id_req,req, res){
    let id_user = req.user.id;
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
}

/**
 * UPDATE product (admin)
 */
async function update_get(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    models.List.findById(id_req).then(async (list)=>{
        if(id_user==list[0].id_user){ 
            let products=[];
            let total = await models.Product.getTotalPrice(id_req);
            let up_prod = await models.Contain.findByIdList(id_req)
            let prod_list = await models.Contain.findForLastMonth(id_user);
            const promises = prod_list.map((prod) => {
            
                return models.Product.findById(prod.id_product).then((prods) => {
                    prods.forEach(prod => {
                        products.push(prod);
                    });
                    return Promise.resolve();
                });
            });
            

            Promise.all(promises).then(() => {
                console.log(total)
                res.render("lists/lists_update", {old_prod: products, total :total[0].total_price_list,id_list:id_req, up_prod:up_prod, userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});

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
    })
}

/**
 * UPDATE modify profile in database (admin cannot update users)
 */
function update_post(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
    
    models.List.findById(id_req).then(async (list)=>{
        if(id_user==list[0].id_user){ 
            let q = req.body;
            let i=0;
            let total=0;
            console.log(q.prices)
            for(i=0;i<q.prices.length;i++){
                total+=parseFloat(q.prices[i]);
            }
            const newList = await models.List.update(id_req,total,list[0].date_list,id_user);
            for(i=0;i<q.prices.length;i++){
                let c = await models.Contain.findOne(id_req,parseInt(q.ids[i]));
                if(c.length > 0){
                    await models.Contain.update(id_req,parseInt(q.ids[i]),parseFloat(q.prices[i]))
                }
                else {
                    await models.Contain.create(id_req,parseInt(q.ids[i]),parseFloat(q.prices[i]))
                }
                
            }

            const flash = {
                msg:"Vous avez modifié la liste avec succès",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-success"
            };
            models.setFlash(flash, res);
            res.redirect("/lists");
    
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
}

async function graphs_get(req,res){
    res.render('graphs/graphs_list', {userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()})
}

async function get_budgets(req,res){
    let budgets = await models.List.findBudgetByUser(id_user);
    res.send(budgets);
}

module.exports = {get, list_info_get, create_get, create_post, delete_post, update_get, update_post,graphs_get,get_budgets};