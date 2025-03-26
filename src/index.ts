import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { applyApi } from './engine';
import { userApi } from './examples/users';
import path from 'path';

const app = express();
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TokenDSL API',
      version: '1.0.0',
      description: 'API documentation for TokenDSL',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/index.html'));
});

// Serve API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Apply our API definitions
applyApi(app, userApi, {
  onSuccess: (req, res, result) => {
    if (req.method === 'POST') {
      res.status(201).json(result);
    } else {
      res.json(result);
    }
  },
  onError: (req, res, error) => {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  },
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Documentation available at http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
