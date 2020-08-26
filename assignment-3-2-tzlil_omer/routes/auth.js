var express = require("express");
var router = express.Router();
const DButils = require("../DB/usersQuery");
const bcrypt = require("bcrypt");



router.post("/login",async (req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    try{
        const user = await DButils.findUser(username);
        if(!user){
            res.status(400).send({ message: "user name not found", success: false });
        }
        if( !await comparePasswords(password, user.password)){
            res.status(401).send({ message: "incorrect password", success: false });
        }else {
            req.session.id = user.userID;
            let resData={userName: user.userName, image: user.imageURL, firstName:user.firstName,lastName:user.lastName, country:user.country ,email:user.email}
            res.status(200).send({userDetails:resData, message: "login succeeded", success: true });
        }
    }catch (e) {
        next(e);
    }
});

router.get("/logout", function (req, res) {
    if (req.session && req.session.id){
        req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
        res.status(200).send({ success: true, message: "logout succeeded" });
    }else {
        res.status(401).send({ message: "unauthorized access", success: false });
    }
});

router.post("/register", async (req, res, next) => {
    try {
        //check parameters exists
        let parCheck=checkRegisterBody(req.body);
        if(!parCheck){
            res.status(406).send({ message: "not all requested fields were fulfilled", success: false });
            return;
        }
        //check username exists
        const username=req.body.username;
        const user = await DButils.findUser(username);
        if(user){
            res.status(405).send({ message: "user name is taken", success: false });
            return;
        }
        // add the new username
        let hash_password = bcrypt.hashSync(req.body.password,10);
        req.body.password=hash_password;
        let id=await getUniqueID();
        await DButils.addUser(id,req.body.username,req.body.password,req.body.lastname,req.body.firstname,req.body.country,req.body.email,req.body.imageURL);
        res.status(200).send({ message: "user created", success: true });
    } catch (error) {
        next(error);
    }
});

let checkRegisterBody =function (body) {
    if(body.username==""||!body.username){
        return false
    }
    if(body.password==""||!body.password){
        return false
    }
    if(body.firstname==""||!body.firstname){
        return false
    }
    if(!body.lastname||body.lastname==""){
        return false
    }
    if(!body.country||body.country==""){
        return false
    }
    if(!body.email||body.email==""){
        return false
    }
    return true
}

function comparePasswords(param1, param2) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(param1, param2, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async function getUniqueID(){
    let temp=Math.floor(Math.random() * 10000)+1 ;
    while (true){
        if(await DButils.checkIfUserExists(temp)){
            return temp;
        }
    }
}

module.exports = router;