import { z } from 'zod';
import { defineApi, NotFoundError } from '../engine';

// In-memory storage
const users = new Map<string, any>();
let nextId = 1;

// Input validation schemas
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(0).max(150)
});

const updateUserSchema = userSchema.partial();

// API definition
export const userApi = defineApi({
  endpoints: [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Get all users',
      tags: ['users'],
      handler: async () => {
        return Array.from(users.values());
      }
    },
    {
      method: 'GET',
      path: '/api/users/:id',
      description: 'Get user by ID',
      tags: ['users'],
      handler: async (data) => {
        const user = users.get(data.id);
        if (!user) {
          throw new NotFoundError('User not found');
        }
        return user;
      }
    },
    {
      method: 'POST',
      path: '/api/users',
      description: 'Create a new user',
      tags: ['users'],
      input: userSchema,
      handler: async (data) => {
        const id = String(nextId++);
        const user = { id, ...data };
        users.set(id, user);
        return user;
      },
      examples: {
        input: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30
        }
      }
    },
    {
      method: 'PUT',
      path: '/api/users/:id',
      description: 'Update user by ID',
      tags: ['users'],
      input: updateUserSchema,
      handler: async (data, req) => {
        const { id } = req.params;
        const existingUser = users.get(id);
        if (!existingUser) {
          throw new NotFoundError('User not found');
        }
        const updatedUser = { ...existingUser, ...data };
        users.set(id, updatedUser);
        return updatedUser;
      }
    },
    {
      method: 'DELETE',
      path: '/api/users/:id',
      description: 'Delete user by ID',
      tags: ['users'],
      handler: async (_, req) => {
        const { id } = req.params;
        const user = users.get(id);
        if (!user) {
          throw new NotFoundError('User not found');
        }
        users.delete(id);
        return { success: true };
      }
    }
  ]
});
