// This file gets pre-loaded before the main module via node CLI option '-r'.
// Because node interacts with this file directly, it must be in JS (not TypeScript)
// and use CommonJS standard
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(process.cwd(), '.env')

dotenv.config({ path: envPath, debug: true });