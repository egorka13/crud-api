import cluster from 'cluster';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { cpus } from 'os';
import { startServer } from './index';

const numCPUs = cpus().length;
let currentWorker = 0;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  const loadBalancer = createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const worker = Object.values(cluster.workers!)[currentWorker];
      worker?.send({ req: req.headers, body: (req as any).body });
      currentWorker = (currentWorker + 1) % (numCPUs - 1);
    }
  );

  loadBalancer.listen(4000, () => {
    console.log('Load balancer listening on port 4000');
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  startServer();
}
