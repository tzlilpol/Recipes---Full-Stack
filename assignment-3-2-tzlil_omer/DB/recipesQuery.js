
const DButils = require("./modules/DButils");
exports.addPrivateRecipe=async function (recID, username, title, image, duration, likes,numOfDishes,vegan,glutenFree,vegetarian) {
    try {
        let sqlst=`insert into personalRecipes values ('${recID}','${username}','${title}','${image}','${duration}','${likes}','${numOfDishes}','${vegan}','${glutenFree}','${vegetarian}')`;
        const query = await DButils.execQuery(sqlst);
    }catch (e) {
        throw e;
    }
}
exports.getPrivateRecipe=async function (recID) {
    try {
        let res = await DButils.execQuery(`SELECT * from personalRecipes where recipeID='${recID}'`);
        if(res.length!==1){
            return null;
        }
        res=res[0];
        res.instructionsAsArray=await getPrivateRecipeOrders(recID);
        res.Ingredients=await getPrivateRecipeIngredients(recID);
        return res;
    }catch (e) {
        throw e;
    }
}
async function getPrivateRecipeIngredients(recID){
    const res = await DButils.execQuery(`SELECT amount,ingredient from personalRecipesIngredients where recipeID='${recID}'`);
    res.map((ing,index)=>{
        ing.name=ing.ingredient;
        delete ing.ingredient;
    })
    return res;
}
async function getPrivateRecipeOrders(recID){
    const res = await DButils.execQuery(`SELECT step,instruction from personalRecipesInstructions where recipeID='${recID}' order by step ASC`);
    res.map((ing,index)=>{
        ing.number=ing.step;
        ing.step=ing.instruction;
        delete ing.instruction;
    })
    return res;
}

exports.addPrRecipeIngredient=async function (recID, amount, ingredient) {
    try {
        const query = await DButils.execQuery(`INSERT INTO personalRecipesIngredients(recipeID,amount,ingredient)VALUES ('${recID}','${amount}', '${ingredient}')`
        );
    }catch (e) {
        console.log(e);
    }
}

exports.addPrRecipeInstruction=async function(recID, number, step) {
    try{
        const query = await DButils.execQuery(`INSERT INTO personalRecipesInstructions(recipeID,step,instruction) 
                VALUES ('${recID}','${number}', '${step}')`
        );
    }catch (e) {
        console.log(e);
    }

}
exports.doubleNumOfDishes=async function(id,userName) {
    console.log(id)
    try{
        const res = await DButils.execQuery(`Select numOfDishes from personalRecipes where  recipeID ='${id}' AND userName='${userName}'` );
        let number=res[0].numOfDishes*2;
        const query1  = await DButils.execQuery(`update personalRecipes SET numOfDishes='${number}' where recipeID ='${id}' AND userName='${userName}'` )
        const result = await DButils.execQuery(`Select * from personalRecipesIngredients where  recipeID ='${id}'` );
        for (let i = 0; i < result.length; i++) {
            let amount=result[i].amount*2;
            const query=await DButils.execQuery(`update personalRecipesIngredients SET amount='${amount}' where recipeID ='${id}' AND ingredient='${result[i].ingredient}'` )
        }
    }catch (e) {
        console.log(e);
    }

}




exports.findUserWatchedRecipeID = async function (userName) {
    try {
        let data=[];

        const result =await DButils.execQuery("SELECT recipeID,watched,saved FROM userRecipesInfo where userName = " +"\'" + userName +"\' and watched=1 ORDER BY timeLastWatched DESC") ;
        if(result.length<3){
            for (let i = 0; i < result.length; i++) {
                let recDetails=result[i];
                data.push(recDetails);
            }
        }else {
            for (let i = 0; i < 3; i++) {
                let recDetails=result[i];
                data.push(recDetails);
            }
        }
        return data;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};

exports.findPreRecipeByID=async function (recID,userName){
    try {
        let Recipe= await DButils.execQuery("SELECT recipeID,title,imageURL,duration,Likes,vegan,glutenFree,vegetarian FROM personalRecipes where recipeID = " +"\'" + recID +"\' ");
        if(Recipe.length==0)
            return null;
        return Recipe;
    }catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};


exports.findUserFavoriteRecipes = async function (userName) {
    try {
        let data=[];
        const result =await DButils.execQuery("SELECT recipeID FROM userRecipesInfo where userName = " +"\'" + userName +"\' and saved=1") ;
        for(const recipeID of result){
            let preRecipe=await DButils.execQuery("SELECT recipeID,title,imageURL,duration,Likes,vegan,glutenFree,vegetarian FROM personalRecipes where recipeID = " +"\'" + recipeID.recipeID +"\'") ;
            data.push(preRecipe[0]);
        }
        return data;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};


exports.findUserFamilyRecipes = async function (userName) {
    try {
        let data=[];
        const result =await DButils.execQuery("SELECT recipeID,eatingOccasions,preparation,image FROM familyRecipes where userName = " +"\'" + userName +"\'") ;
        for(const familyRecipe of result){
            const extraData =await DButils.execQuery("SELECT duration,Likes,vegan,glutenFree,vegetarian FROM personalRecipes where recipeID = " +"\'" + familyRecipe.recipeID +"\'") ;
            familyRecipe.duration=extraData[0].duration;
            familyRecipe.Likes=extraData[0].Likes;
            familyRecipe.vegan=extraData[0].vegan;
            familyRecipe.glutenFree=extraData[0].glutenFree;
            familyRecipe.vegetarian=extraData[0].vegetarian;
            data.push(familyRecipe);
        }
        return data;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};

exports.checkIfRecipeExists = async function(id) {
    const result =await DButils.execQuery(`select recipeID from personalRecipes where recipeID='${id}'`)
    if(result.length==0)
        return true;
    else return false;
}