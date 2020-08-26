

const DButils = require("./modules/DButils");

exports.findUser = async function (userName) {
    try {
        const result = await DButils.execQuery(`SELECT * FROM users where userName ='${userName}'`);
        return result[0];
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};

exports.addUser=async function (id,username,password,lastname,firstname,country,email,imageURL) {
    try {
        const query = await DButils.execQuery(`INSERT INTO users(userID,userName,password,lastName,firstName,country,email,imageURL) 
                VALUES ('${id}','${username}', '${password}','${lastname}','${firstname}','${country}'
                ,'${email}','${imageURL}')`
        );
    }catch (e) {
        throw e;
    }
}
exports.getUserInfoOnRecipes= async function (user_name, id) {
    try {
        const result = await DButils.execQuery(`SELECT * FROM userRecipesInfo where userName ='${user_name}' AND recipeID ='${id}'`);
        if(result.length==0)
            return {watched:false,saved:false};
        return {watched:result[0].watched,saved:result[0].saved};
    }
    catch (err) {
        console.error("SQL error", err);
        throw err;
    }
}

exports.getUserFavoriteRecIDs=async function(user_name){
    try {
        const result = await DButils.execQuery(`SELECT recipeID FROM userRecipesInfo where userName ='${user_name}' AND saved =1`);
        return result;
    }
    catch (err) {
        console.error("SQL error", err);
        throw err;
    }
}

exports.findUserPrivateRecipes = async function (userName) {
    try {
        let data=[];
        const result =await DButils.execQuery("SELECT recipeID,title,duration,Likes,vegan,glutenFree,vegetarian,imageURL FROM personalRecipes where userName = " +"\'" + userName +"\'") ;
        for(const preRecipe of result){
/*            let userData=await DButils.execQuery("select watched,saved from userRecipesInfo where recipeID = " +"\'" + preRecipe.recipeID +"\' and userName = " +"\'" + userName +"\' ");
            preRecipe.watched=userData[0].watched;
            preRecipe.saved=userData[0].saved;*/
            preRecipe.image=preRecipe.imageURL;
            data.push(preRecipe);
        }
        return data;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
};

exports.getUserFamilyRecipes=async function (userName) {
    try {
        let data=[]
        const recipes = await DButils.execQuery(`SELECT recipeID,name,recipeOwner,eatingOccasions,image FROM familyRecipes where userName ='${userName}'`);

        for (let recipe of recipes){
            const ingredients = await DButils.execQuery(`SELECT amount,ingredient FROM familyRecipesIngredients where recipeID ='${recipe.recipeID}'`);
            let ingArr=[]
            for (let ing of ingredients){
                ingArr.push(ing);
            }
            const Instructions = await DButils.execQuery(`SELECT step,instruction FROM familyRecipesSteps where recipeID ='${recipe.recipeID}'`);
            let stepsArr=[]
            for (let step of Instructions){
                stepsArr.push(step);
            }
            recipe.Instructions=stepsArr;
            recipe.ingredients=ingArr;
            data.push(recipe);
        }
        return data;
    }
    catch (err) {
        console.error("SQL error", err);
        throw err;
    }
}

exports.updateWatched= async function (recipeID, userName, watched) {
    try {
        let date = new Date();
        let dateStr = date.toISOString();
        const checkQ = await DButils.execQuery(`Select * from userRecipesInfo where recipeID='${recipeID}' AND userName='${userName}'`);
        if (checkQ.length == 0) {
            await DButils.execQuery(`INSERT INTO userRecipesInfo(recipeID,userName,watched,saved,timeLastWatched)  values ('${recipeID}','${userName}','${watched}','0','${dateStr}')`);
            return true;
        }
        else {
            const updateQ = await DButils.execQuery(`update userRecipesInfo SET watched='${watched}' , timeLastWatched='${dateStr}' where userName ='${userName}' AND recipeID ='${recipeID}'`);
            return true;
        }
    }
    catch(err)
        {
            console.error("SQL error", err);
            throw err;
        }
    }
    exports.updateSaved = async function (recipeID, userName, saved) {
        try {
            let date = new Date();
            let dateStr = date.toISOString();
            const checkQ = await DButils.execQuery(`Select * from userRecipesInfo where recipeID='${recipeID}' AND userName='${userName}'`);
            if (checkQ.length == 0) {
                await DButils.execQuery(`INSERT INTO userRecipesInfo(recipeID,userName,watched,saved,timeLastWatched)  values ('${recipeID}','${userName}','0','${saved}','${dateStr}')`);
                return true;
            }
            else {
                const result = await DButils.execQuery(`update userRecipesInfo SET saved='${saved}' where userName ='${userName}' AND recipeID ='${recipeID}'`);
                return true;
            }
        } catch (err) {
            console.error("SQL error", err);
            throw err;
        }
    }

    exports.checkIfUserExists = async function (id) {
        const result = await DButils.execQuery(`select userID from users where userID='${id}'`);
        if (result.length == 0)
            return true;
        else return false;
    }
    exports.checkIfUserInDB = async function (id) {
        const result = await DButils.execQuery(`select * from users where userID='${id}'`);
        return result[0];
    }
