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
		if(err)console.log(err);
		else{
			let EXPENSE =  expense.filter((u)=>{
			 return u.owner.id.equals(req.user._id)
			 })
			 console.log(EXPENSE);
			res.render("expense",{user:EXPENSE});
		}
	});
});

router.get("/search",isloggedin,async (req,res)=>{
	Expense.find({date:req.query.date},function(err,expense){
		if(err)console.log(err);
		else{
			let reqExpense = expense.filter((u)=>{
				return u.owner.id.equals(req.user._id);
			})
			console.log(reqExpense);
			res.render("expense",{user:reqExpense})		
		}
	});
})

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

router.get("/expense/:id",async(req,res)=>{
	res.send("jii")
	console.log(req.params);
})
router.get("/expense/:id/edit",async (req,res)=>{
	const expense = await Expense.findById(req.params.id);
	res.render("edit",{expense});
})

router.put("/expense/:id",isloggedin,async (req,res)=>{
	await Expense.findByIdAndUpdate(req.params.id,{...req.body.user});
	res.redirect("/expense");
})

router.delete("/expense/:id",async (req,res)=>{
	 await Expense.findByIdAndDelete(req.params.id);
	 res.redirect("/expense")

});

 router.use((err,req,res,next)=>{
	res.send('something went wrong')
})


module.exports = router