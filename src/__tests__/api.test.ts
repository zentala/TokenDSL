import express from 'express';
import request from 'supertest';
import { applyApi } from '../engine';
import { userApi } from '../examples/users';

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    applyApi(app, userApi);
  });

  describe('GET /api/users', () => {
    it('should return empty list initially', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return list of users after creation', async () => {
      // Create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@example.com', age: 30 });
      expect(createResponse.status).toBe(201);

      // Get all users
      const getResponse = await request(app).get('/api/users');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0]).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/123');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return user by id', async () => {
      // Create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@example.com', age: 30 });
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.id;

      // Get user by id
      const getResponse = await request(app).get(`/api/users/${userId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toMatchObject({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@example.com', age: 30 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'invalid-email', age: -1 });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update existing user', async () => {
      // Create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@example.com', age: 30 });
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.id;

      // Update user
      const updateResponse = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'John Updated', age: 31 });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toMatchObject({
        id: userId,
        name: 'John Updated',
        email: 'john@example.com',
        age: 31
      });
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/123')
        .send({ name: 'John Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete existing user', async () => {
      // Create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@example.com', age: 30 });
      expect(createResponse.status).toBe(201);
      const userId = createResponse.body.id;

      // Delete user
      const deleteResponse = await request(app).delete(`/api/users/${userId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ success: true });

      // Verify user is deleted
      const getResponse = await request(app).get(`/api/users/${userId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).delete('/api/users/123');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });
}); 