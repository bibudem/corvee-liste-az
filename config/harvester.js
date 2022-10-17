import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = dirname(fileURLToPath(import.meta.url))

export default {
  maxConcurrency: 10,
  storageDir: join(cwd, '..', '.storage'),
  userDataDir: join(cwd, '..', '.userData'),
}