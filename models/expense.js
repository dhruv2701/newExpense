const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
{
	name: String,
	amount:String,
	description: String,
	date: {type: Date, default: Date.now},
	owner:{
		id:
		{
				type:mongoose.Schema.Types.ObjectId,
				ref:"User"
				
		},
	    usename:String
	}
});

module.exports  = mongoose.model("Expense", expenseSchema);