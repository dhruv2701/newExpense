const express = require('express')
const router = express.Router()
const passport = require('passport');
const expense = require('../models/expense');
const Expense = require('../models/expense')

//=====isloggedin========
function isloggedin(req,res,next){
	if(!req.isAuthenticated()){
		return res.redirect("/"); 
	}
	next();
}

router.get("/new",isloggedin,async (req,res)=>{
	res.render("new");
})
router.get("/expense",isloggedin,async (req,res)=>{
	Expense.find({},function(err,expense){
		//console.log(expense)
		console.log(req.user.username);
		if(err)console.log(err);
		else{
			const EXPENSE =  expense.filter((u)=>{
			 return u.owner.id.equals(req.user._id)
			 })
			res.render("expense",{user:EXPENSE});
		}
	});
});

router.post("/expense",isloggedin,async (req,res)=>{
	const owner={
	 	id:req.user._id,
	 	username:req.user.username
	 }
	const newUser = {...req.body.user,owner:owner}
 	Expense.create(newUser,function(err,expense){
 		if(err)console.log(err);
 		else
 			res.redirect("/expense");		
 	})
	
});

router.delete("/expense/:id",async (req,res)=>{
	 await Expense.findByIdAndDelete(req.params.id);
	 res.redirect("/expense")

});



// router.get("/expense/date",function(req,res){
// 	Expense.find({date:req.body.date},function(err,expense){
// 		if(err)console.log(err);
// 		else{
// 			res.render("date",{user:expense})
// 		}
// 	})
// })

 router.use((err,req,res,next)=>{
	res.send('something went wrong')
})


module.exports = router