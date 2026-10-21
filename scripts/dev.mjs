import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'node_modules/@tailwindcss/cli/dist/index.mjs');
const initialBuild = spawn(process.execPath, [cli, '-i', './css/input.css', '-o', './css/style.css'], { cwd: root, stdio: 'inherit' });
await new Promise((resolve, reject) => initialBuild.on('exit', (code) => code === 0 ? resolve() : reject(new Error('CSS build failed'))));
const watcher = spawn(process.execPath, [cli, '-i', './css/input.css', '-o', './css/style.css', '--watch=always'], { cwd: root, stdio: 'inherit' });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf' };
const server = createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root) || relative.split('/').some((part) => part.startsWith('.')) || relative.startsWith('node_modules/') || !(await stat(file)).isFile()) {
      response.writeHead(404).end('Not found'); return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch { response.writeHead(404).end('Not found'); }
});
server.on('error', (error) => {
  console.error(`Preview server: ${error.message}`);
  watcher.kill();
  process.exitCode = 1;
});
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
const stop = () => { watcher.kill(); server.close(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
