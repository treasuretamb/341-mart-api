const expressProducts = require('express');
const routerProducts = expressProducts.Router();
const { body: bodyProducts, validationResult: validationResultProducts } = require('express-validator');
const Product = require('../models/Product');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog management
 */
// GET all products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
routerProducts.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST create product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number, minimum: 0 }
 *               stock: { type: integer, minimum: 0 }
 *               category: { type: string }
 *               imageUrl: { type: string }
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *     responses:
 *       201:
 *         description: Newly created product
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
routerProducts.post('/', [
  bodyProducts('name').notEmpty().withMessage('Name is required'),
  bodyProducts('description').notEmpty().withMessage('Description is required'),
  bodyProducts('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  bodyProducts('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  const errors = validationResultProducts(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const product = new Product(req.body);
    product.updatedAt = Date.now();
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = routerProducts;