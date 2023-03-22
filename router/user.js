/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         organization:
 *           type: string
 *           description: The organization of the user
 *       example:
 *         id: d5fE_asz
 *         name: Alexander K. Dewdney
 *         email: alex.dewdney@gmail.com
 *         organization: University of Waterloo
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 * /user:
 *   get:
 *     summary: Create a new user
 *     tags: [Users]
 *     parameters:
 *     - in: header
 *       name: userId
 *       schema:
 *         type: integer
 *       required: true
 *       description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */

const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../model/user");

const router = express.Router();

// Path: backend/router/user.js
router.get("/", auth, async (req, res) => {
	const organization = req.user.organization;

	const users = await User.find({ organization: organization });

	res.send(users);
});

router.get("/:id", auth, async (req, res) => {
	const userId = req.params.id;
	const organization = req.user.organization;
	
	const user = await User.find({ _id: userId, organization });

	if (!user) return res.status(404).send({message:"User not found."});

	res.send(user);
});

router.delete("/:id", [auth, admin], async (req, res) => {
	const userId = req.params.id;
	const organization = req.user.organization;

	if(userId === req.user._id) return res.status(400).send({message: "You cannot delete yourself."});

	const {deletedCount} = await User.deleteOne({_id: userId, organization});

	if (deletedCount == 0) return res.status(404).send({message:"User not found."});

	res.send();
});

module.exports = router;
