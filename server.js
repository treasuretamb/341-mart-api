const express = require('express');
const mongooseServer = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

require('./config/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

mongooseServer.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '341martapi',
      version: '1.0.0',
      description: 'API for 341mart online store',
    },
    servers: [
      { url: `http://localhost:${PORT}` }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'passwordHash'],
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            passwordHash: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'stock'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            stock: { type: 'integer', minimum: 0 },
            category: { type: 'string' },
            imageUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => res.send('341martapi is running')); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));