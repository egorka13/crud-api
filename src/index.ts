import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import {
  addUser,
  deleteUser,
  findUserById,
  findUserIndexById,
  getUsers,
  updateUser,
} from './data/users';
import { User } from './models/User';

const PORT = process.env.PORT || 3000;

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET' && req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getUsers()));
  } else if (req.method === 'GET' && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/')[3];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    }

    const user = findUserById(userId);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else if (req.method === 'POST' && req.url === '/api/users') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { username, age, hobbies } = JSON.parse(body);

      if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
      }

      const newUser: User = {
        id: uuidv4(),
        username,
        age,
        hobbies,
      };

      addUser(newUser);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else if (req.method === 'PUT' && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/')[3];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    }

    const userIndex = findUserIndexById(userId);

    if (userIndex !== -1) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedUser = JSON.parse(body);
        const updatedUserWithId = { id: userId, ...updatedUser };

        updateUser(userId, updatedUserWithId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUserWithId));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else if (req.method === 'DELETE' && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/')[3];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    }

    const userIndex = findUserIndexById(userId);

    if (userIndex !== -1) {
      deleteUser(userId);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    // Handle other request methods or routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};

export const startServer = () => {
  const server = createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
