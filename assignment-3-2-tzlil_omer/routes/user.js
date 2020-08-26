var express = require("express");
var router = express.Router();
const DBRecipesQuery = require("../DB/recipesQuery");
const DBUserQuery=require("../DB/usersQuery");
const spoonacularSearch=require("./recipes/search_recipes");

router.use(async (req,res,next)=>{
    if (req.session && req.session.id) {
        const id=req.session.id;
        const user=await DBUserQuery.checkIfUserInDB(id);
        if(user)
        {
            req.user=user;
            next();
        }
    }
    else res.send({status: 401, message: "unauthorized access" });
});
router.get("/myfavorite", async (req, res,next) => {
        const favoriteIDs=await DBUserQuery.getUserFavoriteRecIDs(req.user.userName);
        favorites=[];
        for(let favID of favoriteIDs){
            let preRecipe= await DBRecipesQuery.findPreRecipeByID(favID.recipeID,req.user.userName);
            if(!preRecipe){
                const recipes_id_list=[];
                recipes_id_list.push(favID.recipeID)
                preRecipe=await spoonacularSearch.getRecipesInfo(recipes_id_list);
                preRecipe[0].watched=1;
                preRecipe[0].saved=1;
            }
            favorites.push(preRecipe[0]);
        }
        res.status(200).json(favorites);
});

router.get("/private", async (req, res,next) => {
        let privates=await DBUserQuery.findUserPrivateRecipes(req.user.userName);
        privates.map((recipe,ind)=>{
            recipe.id=recipe.recipeID;
        });
        res.status(200).json(privates);
});
router.get("/private/recipe/:id", async (req, res,next) => {
    try{
        let recipe=await DBRecipesQuery.getPrivateRecipe(req.params.id);
        if(recipe){
            res.status(200).json(recipe);
            next();
        }
    }catch (e) {
        console.log(e);
    }
});
router.get("/private/recipe/:id/doubleNumOfDishes/", async (req, res,next) => {
    try{
        let recipe=await DBRecipesQuery.doubleNumOfDishes(req.params.id,req.user.userName);
        if(recipe){
            res.status(200).json(recipe);
            next();
        }
    }catch (e) {
        console.log(e);
    }
});
router.post("/addRecipe", async (req,res,next)=>{

        if(!checkCrRecipeBody(req.body)){
            res.status(402).send({ message: "necessary data not provided", success: false });
            return ;
        }
        let recID=await getUniqueRecipeID();
        replaceBoolToBit(req.body);
        await DBRecipesQuery.addPrivateRecipe(recID,req.user.userName,req.body.title,req.body.image,req.body.duration,0,req.body.numOfDishes,req.body.vegan,req.body.glutenFree,req.body.vegetarian);
        for(let ing of req.body.ingredients){
            await DBRecipesQuery.addPrRecipeIngredient(recID,ing.amount,ing.name);
        }
        for(let order of req.body.orders){
            await DBRecipesQuery.addPrRecipeInstruction(recID,order.number,order.step);
        }
        res.status(201).send({ message: "recipe created", success: true });
});

router.get("/recipeInfo/:ids",async (req,res)=> {
    const ids = JSON.parse(req.params.ids);
    console.log(ids);
    const user_name = req.user.userName;
    var dict = new Object();
    try {
    for (const id of ids) {
        dict[id]=await DBUserQuery.getUserInfoOnRecipes(user_name, id);
    }
        res.json(dict);
    }
        catch (err) {
            res.status(400).send({ message: "recipe don't exist", success: false });
}

});
router.get("/updateRecipeInfo/id/:recipeID/watched/:watched",async (req,res,next)=>
{
        const recipeID = req.params.recipeID;
        const watched = req.params.watched;
        const userName=req.user.userName;
        try {
            if(await  DBUserQuery.updateWatched(recipeID,userName,watched))
            {
                res.status(200).send({message: "updated successfully", success: true });
            }
        }
        catch (e) {
            next(e);
        }
});
router.get("/updateRecipeInfo/id/:recipeID/saved/:saved",async (req,res,next)=>
{
    const recipeID = req.params.recipeID;
    const saved = req.params.saved;
    const userName=req.user.userName;
    try {
        if(await  DBUserQuery.updateSaved(recipeID,userName,saved))
        {
            res.status(200).send({message: "updated successfully", success: true });
        }
    }
    catch (e) {
        next(e);
    }

});

router.get("/family",async (req,res,next)=>
{
    try{
        const familyRec=await DBUserQuery.getUserFamilyRecipes(req.user.userName);
        res.status(200).json(familyRec);
    }catch (e) {
        next(e);
    }
});

module.exports = router;

let checkCrRecipeBody =function (body) {
    if(body.title==""||!body.title){
        return false
    }
    if(body.image==""||!body.image){
        return false
    }
    if(body.duration==""||!body.duration){
        return false
    }
    if(!body.orders||body.orders.length==0){
        return false
    }
    if(body.numOfDishes==""||!body.numOfDishes){
        return false
    }
    if(!body.ingredients||body.ingredients.length==0){
        return false
    }
    return true
}

async function getUniqueRecipeID(){
    let temp=(new Date()).getTime()%1000000000;
    while (true){
        if(await DBRecipesQuery.checkIfRecipeExists(temp%10000)){
            return temp;
        }
    }
}

function replaceBoolToBit(body) {
    if(!body.vegan)
        body.vegan=0;
    if(!body.glutenFree)
        body.glutenFree=0;
    if(!body.vegetarian)
        body.vegetarian=0;
}