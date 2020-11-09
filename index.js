var express = require('express');
const path = require('path');
var ejsMate = require('ejs-mate');
var mongoose = require('mongoose');
const methodOverride = require('method-override');
var flash = require('connect-flash')
var passport = require('passport');
var localStrategy = require('passport-local');
var passsportLocalMongoose = require('passport-local-mongoose');
var { v4: uuidv4 } = require('uuid');
console.log(uuidv4()); 

var User = require('./models/user')
var expenseRoutes = require('./routes/expense')
var authenticationRoutes = require('./routes/user')

var app = express();
var port = process.env.PORT || 9000;
//var dbUrl = "mongodb+srv://dhruv123:Dhruv#$1@cluster0.qkjap.mongodb.net/mproject?retryWrites=true&w=majority";
var dbUrl = "mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})	
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.engine('ejs',ejsMate)
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash())


//====Passport configuration=======
app.use(require("express-session")({
		secret: "Rusty wins !!!!",
		resave:false,
		saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.message = req.flash("error")
	next()
})


//=====isloggedin========
function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/"); 
}

app.use(authenticationRoutes)
app.use(expenseRoutes)


app.listen(port,function(){
	console.log(`server is on port ${port}`)
})