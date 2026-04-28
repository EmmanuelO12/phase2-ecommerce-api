import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Simple E-commerce API',
      version: '1.0.0',
      description:
        'REST API with JWT authentication, role/ownership authorization, Prisma, and PostgreSQL.',
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check',
          responses: {
            200: { description: 'API is running' },
          },
        },
      },
      '/api/auth/signup': {
        post: {
          summary: 'Sign up',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  email: 'user@example.com',
                  password: 'Password123!',
                  role: 'USER',
                },
              },
            },
          },
          responses: {
            201: { description: 'User created' },
            400: { description: 'Validation error' },
            409: { description: 'Email conflict' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Log in',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: { email: 'user@example.com', password: 'Password123!' },
              },
            },
          },
          responses: {
            200: { description: 'Token + user' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/products': {
        get: {
          summary: 'List products',
          responses: { 200: { description: 'Product list' } },
        },
        post: {
          summary: 'Create product (admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  name: 'Laptop',
                  description: '14-inch ultrabook',
                  priceCents: 120000,
                  stock: 25,
                  isActive: true,
                },
              },
            },
          },
          responses: {
            201: { description: 'Created' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/api/products/{id}': {
        get: {
          summary: 'Get product by id',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Product found' },
            404: { description: 'Not found' },
          },
        },
        put: {
          summary: 'Update product (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  priceCents: 125000,
                  stock: 20,
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated' },
            403: { description: 'Forbidden' },
          },
        },
        delete: {
          summary: 'Soft delete product (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Deleted' },
          },
        },
      },
      '/api/orders': {
        get: {
          summary: 'List orders for logged-in user',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Order list' }, 401: { description: 'Unauthorized' } },
        },
        post: {
          summary: 'Create order',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  items: [
                    {
                      productId: '11111111-1111-1111-1111-111111111111',
                      quantity: 1,
                    },
                  ],
                },
              },
            },
          },
          responses: { 201: { description: 'Created' }, 400: { description: 'Invalid order' } },
        },
      },
      '/api/orders/{id}': {
        get: {
          summary: 'Get order by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Order found' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
          },
        },
        put: {
          summary: 'Update order status',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { example: { status: 'CANCELLED' } } },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          summary: 'Cancel order',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Cancelled' } },
        },
      },
      '/api/reviews': {
        get: {
          summary: 'List reviews',
          responses: { 200: { description: 'Review list' } },
        },
        post: {
          summary: 'Create review',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: {
                  productId: '11111111-1111-1111-1111-111111111111',
                  rating: 5,
                  comment: 'Great product',
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/reviews/{id}': {
        get: {
          summary: 'Get review by id',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Review found' }, 404: { description: 'Not found' } },
        },
        put: {
          summary: 'Update review (owner/admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { example: { rating: 4, comment: 'Updated review' } } },
          },
          responses: { 200: { description: 'Updated' } },
        },
        delete: {
          summary: 'Delete review (owner/admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' } },
        },
      },
    },
  },
  apis: [],
});
