const mongoose = require("mongoose");

/* 
	This middleware checks if id's in req.params are valid ObjectId's.
	If they are not, then it returns a 400 status code.
*/

module.exports = (req, res, next) => {

	const cond = Object.values(req.params).every((param) => {
		return mongoose.isValidObjectId(param)
	});

	if (!cond) return res.status(400).send({ message: "Invalid id."});

	next();
}