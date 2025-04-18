const expressUsers = require('express');
const routerUsers = expressUsers.Router();
const { body: bodyUsers, validationResult: validationResultUsers } = require('express-validator');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
// GET all users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
routerUsers.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST create user
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               passwordHash: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               role: { type: string, enum: ['user', 'admin'] }
 *             required:
 *               - username
 *               - email
 *               - passwordHash
 *     responses:
 *       201:
 *         description: Newly created user
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
routerUsers.post('/', [
  bodyUsers('username').notEmpty().withMessage('Username is required'),
  bodyUsers('email').isEmail().withMessage('Valid email is required'),
  bodyUsers('passwordHash').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResultUsers(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = new User(req.body);
    user.updatedAt = Date.now();
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = routerUsers;