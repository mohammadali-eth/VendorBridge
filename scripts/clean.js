import { rm } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const pathsToClean = [
  'node_modules',
  'apps/frontend/node_modules',
  'apps/frontend/dist',
  'apps/backend/node_modules',
  'packages/constants/node_modules',
  'packages/types/node_modules',
  'packages/validators/node_modules',
  'packages/shared/node_modules',
];

async function clean() {
  console.log('Cleaning monorepo build folders & dependencies...');
  for (const p of pathsToClean) {
    const fullPath = join(__dirname, '..', p);
    try {
      await rm(fullPath, { recursive: true, force: true });
      console.log(`Deleted: ${p}`);
    } catch (e) {
      console.error(`Failed deleting ${p}:`, e.message);
    }
  }
}

clean();
