import { z } from 'zod';
import { defineApi } from '../dsl';

// Define schemas
const UserSchema = z.object({
  id: z.string().describe('User ID'),
  name: z.string().describe('Full name of the user'),
  email: z.string().email().describe('Email used for login'),
});

const CreateUserSchema = UserSchema.omit({ id: true });
const UpdateUserSchema = CreateUserSchema.partial();

// In-memory storage for users
const users = new Map<string, z.infer<typeof UserSchema>>([
  ['1', { id: '1', name: 'John Doe', email: 'john@example.com' }],
  ['2', { id: '2', name: 'Jane Smith', email: 'jane@example.com' }],
]);

// Define handlers
async function createUser(input: z.infer<typeof CreateUserSchema>) {
  const id = Math.random().toString(36).substring(7);
  const user = { id, ...input };
  users.set(id, user);
  return user;
}

async function getUserById(input: { id: string }) {
  const user = users.get(input.id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

async function updateUser(input: { id: string } & z.infer<typeof UpdateUserSchema>) {
  const existingUser = users.get(input.id);
  if (!existingUser) {
    throw new Error('User not found');
  }
  const updatedUser = { ...existingUser, ...input };
  users.set(input.id, updatedUser);
  return updatedUser;
}

async function deleteUser(_input: { id: string }) {
  const user = users.get(_input.id);
  if (!user) {
    throw new Error('User not found');
  }
  users.delete(_input.id);
  return { success: true };
}

async function getAllUsers() {
  return Array.from(users.values());
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user
 *           example: "123"
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "john@example.com"
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "john@example.com"
 *     DeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the deletion was successful
 *           example: true
 * 
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users in the system
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: "1"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *               - id: "2"
 *                 name: "Jane Smith"
 *                 email: "jane@example.com"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
export const userApi = defineApi({
  'GET /api/users': {
    handler: getAllUsers,
    description: 'Get all users',
    tags: ['users', 'read'],
    exampleOutput: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ],
    uiSchema: {
      layout: 'table',
      fields: {
        id: { type: 'text', label: 'ID', display: 'readonly' },
        name: { type: 'text', label: 'Name' },
        email: { type: 'email', label: 'Email' },
      },
    },
  },
  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     description: Returns a single user by their unique identifier
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *         example: "123"
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *             example:
   *               id: "123"
   *               name: "John Doe"
   *               email: "john@example.com"
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "User not found"
   */
  'GET /api/users/:id': {
    input: z.object({ id: z.string().describe('User ID') }),
    handler: getUserById,
    description: 'Get user by ID',
    tags: ['users', 'read'],
    exampleOutput: { id: '123', name: 'John Doe', email: 'john@example.com' },
    uiSchema: {
      layout: 'card',
      fields: {
        id: { type: 'text', label: 'User ID', display: 'readonly' },
      },
    },
  },
  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     description: Creates a new user with the provided details
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 description: Full name of the user
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email address of the user
   *                 example: "john@example.com"
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *             example:
   *               id: "123"
   *               name: "John Doe"
   *               email: "john@example.com"
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid email format"
   */
  'POST /api/users': {
    input: CreateUserSchema,
    handler: createUser,
    description: 'Create a new user',
    tags: ['users', 'create'],
    exampleInput: { name: 'John Doe', email: 'john@example.com' },
    exampleOutput: { id: '123', name: 'John Doe', email: 'john@example.com' },
    uiSchema: {
      layout: 'form',
      fields: {
        name: { type: 'text', label: 'Full name' },
        email: { type: 'email', label: 'Email address' },
      },
    },
  },
  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user
   *     description: Updates an existing user with the provided details
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *         example: "123"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUser'
   *           example:
   *             name: "John Doe Updated"
   *             email: "john.updated@example.com"
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *             example:
   *               id: "123"
   *               name: "John Doe Updated"
   *               email: "john.updated@example.com"
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "User not found"
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid email format"
   */
  'PUT /api/users/:id': {
    input: z.object({
      id: z.string().describe('User ID'),
      ...UpdateUserSchema.shape,
    }),
    handler: updateUser,
    description: 'Update user',
    tags: ['users', 'update'],
    exampleInput: { id: '123', name: 'John Doe Updated', email: 'john.updated@example.com' },
    exampleOutput: { id: '123', name: 'John Doe Updated', email: 'john.updated@example.com' },
    uiSchema: {
      layout: 'form',
      fields: {
        id: { type: 'text', label: 'User ID', display: 'readonly' },
        name: { type: 'text', label: 'Full name' },
        email: { type: 'email', label: 'Email address' },
      },
    },
  },
  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete user
   *     description: Deletes an existing user
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *         example: "123"
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DeleteResponse'
   *             example:
   *               success: true
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "User not found"
   */
  'DELETE /api/users/:id': {
    input: z.object({ id: z.string().describe('User ID') }),
    handler: deleteUser,
    description: 'Delete user',
    tags: ['users', 'delete'],
    exampleOutput: { success: true },
    uiSchema: {
      layout: 'card',
      fields: {
        id: { type: 'text', label: 'User ID', display: 'readonly' },
      },
    },
  },
});
