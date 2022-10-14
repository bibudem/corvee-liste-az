import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = dirname(fileURLToPath(import.meta.url))

export default {
  // ignore: [
  //   'https://bib.umontreal.ca',
  //   'https://www.umontreal.ca'
  //   // /^https?:\/\/((?:libguides)\.bib\.)?umontreal\.ca/i
  // ],
  internLinks: 'https://libguides.bib.umontreal.ca/az.php',
  maxConcurrency: 10,
  pageWaitUntil: {
    intern: 'networkidle',
    extern: 'load'
  },
  // startUrl: 'https://libguides.bib.umontreal.ca/az.php',
  storageDir: join(cwd, '..', '.storage'),
  userDataDir: join(cwd, '..', '.userData'),
}