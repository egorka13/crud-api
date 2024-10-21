import { createServer, Server } from 'http';
import request from 'supertest';
import { requestHandler } from '../index';

describe('CRUD API Tests', () => {
  let server: Server;
  let userId: string;

  beforeAll((done) => {
    server = createServer(requestHandler);
    server.listen(4000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  test('GET /api/users - should return empty array initially', (done) => {
    request(server)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual([]);
        done();
      });
  });

  test('POST /api/users - should create a new user and return it', (done) => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: [],
    };

    request(server)
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toBe(newUser.username);
        expect(res.body.age).toBe(newUser.age);
        expect(res.body.hobbies).toStrictEqual(newUser.hobbies);
        userId = res.body.id; // Save the userId for later tests
        done();
      });
  });

  test(`GET /api/users/:userId - should return the created user`, (done) => {
    request(server)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('id', userId);
        done();
      });
  });

  test(`PUT /api/users/:userId - should update the user`, (done) => {
    const updatedUser = {
      username: 'John Doe 2',
      age: 31,
      hobbies: ['hiking'],
    };

    request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.username).toBe(updatedUser.username);
        expect(res.body.age).toBe(updatedUser.age);
        expect(res.body.hobbies).toStrictEqual(updatedUser.hobbies);
        expect(res.body.id).toBe(userId); // Ensure the ID remains the same
        done();
      });
  });

  test(`DELETE /api/users/:userId - should delete the user`, (done) => {
    request(server)
      .delete(`/api/users/${userId}`)
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  test(`GET /api/users/:userId - should return 404 for a deleted user`, (done) => {
    request(server)
      .get(`/api/users/${userId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('User not found');
        done();
      });
  });
});
