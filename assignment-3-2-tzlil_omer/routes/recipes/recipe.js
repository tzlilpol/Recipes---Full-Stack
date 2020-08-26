var express = require("express");
var router = express.Router();
//#region this is belong to recipes module
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

const search_util=require("./search_recipes");
const searchUtilPrivate=require("../../DB/recipesQuery")

router.use((req,res,next)=>{
  console.log("Recipes route");
  next();
});
//routes
router.get("/search/query/:searchQuery/amount/:num",(req,res)=>{
  const {searchQuery,num}=req.params;
  let search_params= {};
  search_params.query=searchQuery;
  search_params.number=num;
  search_params.instructionsRequired=true;

  //check if queries params exists
  console.log(req.query);
  search_util.extractQueriesParams(req.query,search_params);

  search_util
      .searchForRecipes(searchQuery,num,search_params)
      .then((info_array)=>res.send(info_array))
      .catch((error)=>{
        console.log(error);
        res.sendStatus(500);
          }
      )
});

router.get("/Information", async (req, res, next) => {
  try {
    const recipe = await getRecipeInfo(req.query.recipe_id);
    res.send({ data: recipe.data });
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances, number } = req.query;
    const search_response = await axios.get(`${api_domain}/search`, {
      params: {
        query: query,
        cuisine: cuisine,
        diet: diet,
        intolerances: intolerances,
        number: number,
        instructionsRequired: true,
        apiKey: process.env.spooncular_apiKey
      }
    });
    let recipes = await Promise.all(
      search_response.data.results.map((recipe_raw) =>
        getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    res.send({ data: recipes });
  } catch (error) {
    next(error);
  }
});

function getRecipeInfo(id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

router.get("/:id", async (req, res,next) => {

  const recipes_id_list=[];
  recipes_id_list.push(JSON.parse(req.params.id));
  let ans
  try {
    ans= await search_util.getFullRecipesInfo(recipes_id_list);
    res.status(200).json(ans);
  }
  catch (e) {
    res.status(400).send({ message: "recipe don't exist", success: false });
  }
});
//#endregion
module.exports=router;