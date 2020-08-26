var express = require("express");
var DBRecipeSearch=require("../DB/recipesQuery")
var spoonacularSearch=require("./recipes/search_recipes");
var DBUserQuery=require("../DB/usersQuery");
var router = express.Router();
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const api_key="apiKey="+process.env.spooncular_apiKey;

router.get("/",async (req, res) =>{
    console.log(req.session);
    if (req.session && req.session.id) {
        const id = req.session.id;
        const user = await DBUserQuery.checkIfUserInDB(id);
        if (user) {
            req.user = user;
            let data = await obtainThreeRandomPreRecipes();
            let secondData = [];
            let watchedRecIds = await DBRecipeSearch.findUserWatchedRecipeID(req.user.userName);
            for (let recDetails of watchedRecIds) {
                let preRecipe = await DBRecipeSearch.findPreRecipeByID(recDetails.recipeID, req.user.userName);
                if (!preRecipe) {
                    const recipes_id_list = [];
                    recipes_id_list.push(recDetails.recipeID)
                    preRecipe = await spoonacularSearch.getRecipesInfo(recipes_id_list);
                    preRecipe[0].watched = recDetails.watched;
                    preRecipe[0].saved = recDetails.saved;
                }
                secondData.push(preRecipe[0]);
            }
            data = data.concat(secondData);
            res.status(201).json(data);
        }
    }
        else {
            let data=await obtainThreeRandomPreRecipes();
            res.status(200).json(data);
        }
});

let obtainThreeRandomPreRecipes= async function () {
    let data=[];
    try {
        let search_response = await axios.get(`${api_domain}/random?number=3&${api_key}`);
        for (let i = 0; i < 3; i++) {
            let randPreRecipe={
                id :search_response.data.recipes[i].id,
                title : search_response.data.recipes[i].title,
                image : search_response.data.recipes[i].image,
                duration :search_response.data.recipes[i].readyInMinutes,
                likes : 0, //need change
                vegetarian : search_response.data.recipes[i].vegetarian,
                glutenFree : search_response.data.recipes[i].glutenFree,
                vegan : search_response.data.recipes[i].vegan
            }
            data.push(randPreRecipe);
        }
    }catch (e) {
        console.log(e);
    }
    return data;
    };


module.exports=router;