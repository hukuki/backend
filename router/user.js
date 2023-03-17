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

const router = express.Router();

// Path: backend/router/user.js
router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;