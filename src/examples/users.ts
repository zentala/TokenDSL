import { z } from 'zod';
import { defineApi } from '../dsl';

// Define schemas
const UserSchema = z.object({
  id: z.string().describe('User ID'),
  name: z.string().describe('Full name of the user'),
  email: z.string().email().describe('Email used for login'),
});

const CreateUserSchema = UserSchema.omit({ id: true });

// Define handlers
async function createUser(input: z.infer<typeof CreateUserSchema>) {
  // In a real app, this would save to a database
  return {
    id: '123', // Generated ID
    ...input,
  };
}

async function getUserById(input: { id: string }) {
  // In a real app, this would fetch from a database
  return {
    id: input.id,
    name: 'John Doe',
    email: 'john@example.com',
  };
}

// Define API
export const userApi = defineApi({
  'GET /users/:id': {
    input: z.object({ id: z.string().describe('User ID') }),
    handler: getUserById,
    description: 'Fetch a user by ID',
    tags: ['users', 'read'],
    exampleOutput: { id: '123', name: 'John Doe', email: 'john@example.com' },
    commitHint: 'Add user fetch endpoint',
    uiSchema: {
      layout: 'card',
      fields: {
        id: { type: 'text', label: 'User ID', display: 'readonly' },
      },
    },
  },
  'POST /users': {
    input: CreateUserSchema,
    handler: createUser,
    description: 'Create a new user',
    tags: ['users', 'create'],
    exampleInput: { name: 'John Doe', email: 'john@example.com' },
    commitHint: 'Add user creation endpoint',
    uiSchema: {
      layout: 'form',
      fields: {
        name: { type: 'text', label: 'Full name' },
        email: { type: 'email', label: 'Email address' },
      },
    },
  },
});
