let models = require('../models');

//GESTION 403 SI EST CONNECTE OU PAS 
function get(req, res) {
    let id_user = req.user.id;
    models.List.findByUser(id_user).then(li => {
        const col_1=[];
        const col_2=[];
        const col_3=[];
        const lists = li.map(x => {
            return {
                id_list : x.id_list,
                date_list: changeDate(x.date_list),
            }
        })
        let size = lists.length;
        let i = 0;
        for(i=0;i<lists.length;i++){
            if (i%3 == 0){
                col_1.push(lists[i]);
            } else if(i%3 == 1){
                col_2.push(lists[i]);
            } else {
                col_3.push(lists[i]);
            }
        }
        const flash = models.getFlash(req);
        models.destroyFlash(res);
        res.render("lists/lists_list", {col_1: col_1,col_2: col_2,col_3: col_3, errors:flash, userAdmin:req.user.isAdmin == 1? true : false, csrfToken: req.csrfToken()});
        return;
    })
}

function changeDate(date){
    let day = date.getDate();
    let month=date.getMonth()+1;
    
    if(day<10){
        day = "0" + day;
    } 
    if(month<10){
        month = "0" + month;
    }
    d = day+"/"+month+"/"+date.getFullYear();
    return d;
}

function list_info_get(req, res) {
    let id_user = req.user.id;
    models.List.findByUser(id_user).then(lists => {
        res.render("lists/lists_list", {lists: lists, userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});
        return;
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
            const flash = models.getFlash(req);
            models.destroyFlash(res);
            res.render("lists/lists_create", {prod_list: prod_list,products:products, errors:flash,userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});
            return;
        });
        
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

async function create_post(req, res){
    let id_user = req.user.id;
    
    let q = req.body;
    //console.log(q.prices)
    let i=0;
    let total=0;
    if(q.prices){
        //console.log(q.prices)
        if(typeof q.prices === 'string') {
            total = parseFloat(q.prices);
        } else {
            for(i=0;i<q.prices.length;i++){
                total+=parseFloat(q.prices[i]);
            }
        }

        total=parseFloat(total)
        if(isNaN(total)){
            const flash = {
                msg:"Tous les champs prix doivent être renseignés",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-danger"
            };
            models.setFlash(flash, res);
            res.redirect("/lists/create");
            return;
        } else {
            const newList = await models.List.create(total,id_user);
            if (typeof q.prices === 'string') {
                await models.Contain.create(newList.insertId,parseInt(q.ids),parseFloat(q.prices))
            } else {
                for(i=0;i<q.prices.length;i++){
                    await models.Contain.create(newList.insertId,parseInt(q.ids[i]),parseFloat(q.prices[i]))
                }
            }
            

            const flash = {
                msg:"Vous avez créé la liste avec succès",
                //type : alert-danger {errors}, alert-success {{success}}
                alert:"alert-success"
            };
            models.setFlash(flash, res);
            res.redirect("/lists");
            return;
        }
    }else{
        const flash = {
            msg:"Vous devez entrer au moins un produit",
            //type : alert-danger {errors}, alert-success {{success}}
            alert:"alert-danger"
        };
        models.setFlash(flash, res);
        res.redirect("/lists/create");
        return;
    }
    
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
                return;
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
                res.render("lists/lists_update", {old_prod: products, total :total[0].total_price_list,id_list:id_req, up_prod:up_prod, userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()});
                return;
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
async function update_post(id_req,req, res) {
    let id_user = req.user.id; //recover id from token
        
    models.List.findById(id_req).then(async (list)=>{
        if(id_user==list[0].id_user){ 
            let allContain= await models.Contain.findByIdList(id_req);
            let idP = allContain.map(x=>x.id_product);
            
            let q = req.body;
            let i=0;
            /**
             * Delete products remove from the list in the database
             */
            if(typeof q.ids === 'string') {
                if(idP.includes(parseInt(q.ids))){
                    idP.splice(idP.indexOf(parseInt(q.ids)),1)
                }
            } else {
                for(i=0;i<q.ids.length;i++){
                    if(idP.includes(q.ids[i])){
                        idP.splice(idP.indexOf(q.ids[i]),1)
                    }
                }
            }

            idP.forEach(async id => await models.Contain.delete(id_req,id))
            
            /**
             * Calcul of the total list price
             */
            let total=0;
            if(q.prices){
                if(typeof q.prices === 'string') {
                    total = parseFloat(q.prices);
                } else {
                    for(i=0;i<q.prices.length;i++){
                        total+=parseFloat(q.prices[i]);
                    }
                }

                /**
                 * Update or create the containers of the list
                 */
                if(isNaN(total)){
                    const flash = {
                        msg:"Tous les champs prix doivent être renseignés",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-danger"
                    };
                    models.setFlash(flash, res);
                    res.redirect("/lists/create");
                    return;
                } else {
                    const newList = await models.List.update(id_req,total,list[0].date_list,id_user);
                    if (typeof q.prices === 'string') {
                        let c = await models.Contain.findOne(id_req,parseInt(q.ids));
                            if(c.length > 0){
                                await models.Contain.update(id_req,parseInt(q.ids),parseFloat(q.prices))
                            }
                            else {
                                await models.Contain.create(id_req,parseInt(q.ids),parseFloat(q.prices))
                            } 
                    } else {
                        for(i=0;i<q.prices.length;i++){
                            let c = await models.Contain.findOne(id_req,parseInt(q.ids[i]));
                            if(c.length > 0){
                                await models.Contain.update(id_req,parseInt(q.ids[i]),parseFloat(q.prices[i]))
                            }
                            else {
                                await models.Contain.create(id_req,parseInt(q.ids[i]),parseFloat(q.prices[i]))
                            } 
                        }
                    }
                    

                    const flash = {
                        msg:"Vous avez modifié la liste avec succès",
                        //type : alert-danger {errors}, alert-success {{success}}
                        alert:"alert-success"
                    };
                    models.setFlash(flash, res);
                    res.redirect("/lists");
                    return;
                }
            }else{
                const flash = {
                    msg:"Vous devez entrer au moins un produit",
                    //type : alert-danger {errors}, alert-success {{success}}
                    alert:"alert-danger"
                };
                models.setFlash(flash, res);
                res.redirect("/lists/create");
                return;
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
    })
}

async function graphs_get(req,res){
    res.render('graphs/graphs_list', {userAdmin:req.user.isAdmin == 1? true : false,csrfToken: req.csrfToken()})
    return;
}

async function get_budgets(req,res){
    let id_user = req.user.id;
    let last_month = await models.List.getLastMonthList(id_user);
    let i = 0;
    let budgets = [];
    for (i = 1;i<=last_month[0].last_month;i++){
        budgets.push(await models.List.findPricesByMonth(i,id_user));
    }
    
    res.send(budgets);
    return;
}

module.exports = {get, list_info_get, create_get, create_post, delete_post, update_get, update_post,graphs_get,get_budgets};