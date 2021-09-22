// This file gets pre-loaded before the main module via node CLI option '-r'.
// Because node interacts with this file directly, it must be in JS (not TypeScript)
// and use CommonJS standard
const dotenv = require('dotenv');
const tsNode = require('ts-node');
const path = require('path');

const devEnvPath = path.join(process.cwd(), '.env.local');

dotenv.config({ path: devEnvPath, debug: true });

// auto-compile and run TS without emitting files
tsNode.register();