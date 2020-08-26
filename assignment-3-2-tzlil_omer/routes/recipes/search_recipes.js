var express = require("express");
var router = express.Router();
//#region this is belong to recipes module
const axios = require("axios");
//spoonacular settings
const recipes_api_url="https://api.spoonacular.com/recipes";


function extractQueriesParams(query_params,search_params) {
    //search_params passed by ref
    //Iterate on params list to identify only wanted params
    const param_list = ["diet", "cuisine", "intolerance"];
    param_list.forEach((param) => {
        //check if the params in query is on of diet,cuisine,intolerance
        if (query_params[param]) {
            //add the param to search_params
            search_params[param] = query_params[param];
        }
    });
    console.log(search_params);
}


async  function searchForRecipes(searchQuery,num,search_params) {
    let search_response=await axios.get(
        `${recipes_api_url}/search?apiKey=${process.env.spooncular_apiKey}`,
        {
            params: search_params,
        },
    );
    const recipes_id_list=extractSearchResultsIds(search_response);
    console.log(recipes_id_list);
    //Get recipes info by id
    let info_array= await getRecipesInfo(recipes_id_list);
    console.log("info_array:",info_array);
    return info_array;
};
async function getRecipesInfo(recipes_id_list) {
    let promises=[];
    //for each id - get promise of GET response
    recipes_id_list.map((id)=>
    promises.push(axios.get(`${recipes_api_url}/${id}/information?apiKey=${process.env.spooncular_apiKey}`))
    );
    let info_response1=await Promise.all(promises);
    return extractRelevantRecipeData(info_response1);
}
function  extractRelevantRecipeData(recipes_Info) {
    return recipes_Info.map((recipes_Info)=>{
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        }=recipes_Info.data;
        return {
            id: id,
            title: title,
            duration: readyInMinutes,
            likes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
        };
    });
}
async function promiseAll(func,param_list) {
    let promises=[];
    param_list.map((param)=>promises.push(func(param)));
    let info_response=await Promise.all(promises);

    return info_response;
}

function extractSearchResultsIds(search_response) {
    let recipes = search_response.data.results;
    let recipes_id_list = [];
    recipes.map((recipe) => {
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}
async function getFullRecipesInfo(recipes_id_list) {
    let promises=[];
    recipes_id_list.map((id)=>
        promises.push(axios.get(`${recipes_api_url}/${id}/information?apiKey=${process.env.spooncular_apiKey}`))
    );
    let info_response;
    try {
        info_response=await Promise.all(promises);
    }
    catch (e) {
        res.send({status: 400, success: false,message:"recipe don't exist" });
    }

    let param_list=extractFullRecipeData(info_response[0]);

    let promises2=[];
    recipes_id_list.map((id)=>
        promises2.push(axios.get(`${recipes_api_url}/${recipes_id_list}/analyzedInstructions?apiKey=${process.env.spooncular_apiKey}`))
    );
    let info_response2=await Promise.all(promises2);
    let Ingredients=[];
    param_list.extendedIngredients.forEach((param) => {
        Ingredients.push({name:param.name,amount:param.amount})
    });
    param_list.Ingredients=Ingredients;
    let instructionsAsArray=[];
    info_response[0].data.analyzedInstructions.forEach((instruction) => {
        for(ins of instruction.steps)
            instructionsAsArray.push({number:ins.number,step:ins.step})
    });
    param_list.instructionsAsArray=instructionsAsArray;
    return param_list;

}
function extractFullRecipeData(recipes_Info) {
    let data={
        'id':recipes_Info.data.id,
        'title':recipes_Info.data.title,
        'servings':recipes_Info.data.servings,
        'readyInMinutes':recipes_Info.data.readyInMinutes,
        'aggregateLikes':recipes_Info.data.aggregateLikes,
        'vegetarian':recipes_Info.data.vegetarian,
        'vegan':recipes_Info.data.vegan,
        'glutenFree':recipes_Info.data.glutenFree,
        'image':recipes_Info.data.image,
        'extendedIngredients':recipes_Info.data.extendedIngredients,
        'instructions': recipes_Info.data.instructions

    };
    return data;
}
exports.getFullRecipesInfo=getFullRecipesInfo;
exports.extractFullRecipeData=extractFullRecipeData;
exports.searchForRecipes=searchForRecipes;
exports.extractQueriesParams=extractQueriesParams;
exports.getRecipesInfo=getRecipesInfo;
