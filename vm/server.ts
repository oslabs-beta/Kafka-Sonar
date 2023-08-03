import fs from 'fs';
import metricsServer from './server/metricsServer';
import socketServer from './server/socketServer';
import { SOCKET_PATH } from './server/constants';
import { METRICS_PORT } from './server/constants';

// If a socket file exists, delete it for reusability.
try {
  if (fs.existsSync(SOCKET_PATH)) {
    fs.unlinkSync(SOCKET_PATH);
  }
} catch (err) {
  console.error('Error deleting socket file:', err);
}

metricsServer.listen(METRICS_PORT, () => {
  console.log(`🚀 Server listening on Port ${METRICS_PORT}`);
});

socketServer.listen(SOCKET_PATH, () => {
  console.log(`🚀 Server listening on Socket ${SOCKET_PATH}`);
});
