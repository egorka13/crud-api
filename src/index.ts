import http from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { users } from './data/users';
import { User } from './models/User';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/api/users') {
    res.writeHead(200);
    res.end(JSON.stringify(users));
  } else if (req.method === 'GET' && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/')[2];

    if (!isUuid(userId)) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    }

    const user = users.find((user) => user.id === userId);

    if (user) {
      res.writeHead(200);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else if (req.method === 'POST' && req.url === '/api/users') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { name, email, age } = JSON.parse(body);

      if (!name || !email || typeof age !== 'number') {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Missing required fields' }));
      }

      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        age,
      };

      users.push(newUser);

      res.writeHead(201);
      res.end(JSON.stringify(newUser));
    });
  } else if (req.method === 'PUT' && req.url?.startsWith('/api/users/')) {
    const userId = req.url.split('/')[2];

    if (!isUuid(userId)) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedUser = JSON.parse(body);

        users[userIndex] = { id: userId, ...updatedUser };
        res.writeHead(200);
        res.end(JSON.stringify(users[userIndex]));
      });
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  } else {
    // Handle other request methods or routes
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
