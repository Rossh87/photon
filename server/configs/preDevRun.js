// This file gets pre-loaded before the main module via node CLI option '-r'.
// Because node interacts with this file directly, it must be in JS (not TypeScript)
// and use CommonJS standard
const dotenv = require('dotenv');
const tsNode = require('ts-node');
const path = require('path');

const DEV_ENV_PATH = path.join(process.cwd(), '.env.local');
const PROD_ENV_PATH = path.join(process.cwd(), '.env');

// important to pass correct environment when we invoke node
const envPath = process.env.NODE_ENV === 'dev' ? DEV_ENV_PATH : PROD_ENV_PATH;

dotenv.config({ path: envPath, debug: true });

// auto-compile and run TS without emitting files
tsNode.register();
