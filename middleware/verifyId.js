const mongoose = require("mongoose");

module.exports = (req, res, next) => {

	const cond = Object.values(req.params).every((param) => {
		return mongoose.isValidObjectId(param)
	});

	if (!cond) return res.status(400).send({ message: "Invalid id."});

	next();
}