require("dotenv").config();
var cors=require("cors");
//#region express configures
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("client-sessions");

//#app setting and config
var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 30 * 60 * 1000, // expired after 30 minutes
    activeDuration: 0, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
    cookie:{
        httpOnly: false
    }
  })
);

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files
const corsOptions = {
    origin: true,
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors())

var port = process.env.PORT || "3000";

//#routs importing
const home = require("./routes/home");
const auth = require("./routes/auth");
const recipes = require("./routes/recipes/recipe");
const users = require("./routes/user");




//#Routing
app.use(home);
app.use("/recipe", recipes);
app.use(auth);
app.use("/user", users);

app.use(errorPrinting);

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});


function errorPrinting (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send({ message: err.message, success: false });
}

