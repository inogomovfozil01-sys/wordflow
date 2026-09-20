import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), '.pgdata');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Initializing persistent PGlite PostgreSQL database at:', dataDir);
const db = new PGlite(dataDir);
await db.waitReady;

const port = parseInt(process.env.PGPORT || '5433', 10);
const host = '127.0.0.1';

const server = new PGLiteSocketServer({
  db,
  port,
  host,
});

await server.start();
console.log(`🚀 WordFlow Local PostgreSQL Server running on ${host}:${port}/postgres`);

// Keep alive
process.on('SIGINT', async () => {
  console.log('Shutting down local PostgreSQL server...');
  await server.stop();
  process.exit(0);
});
