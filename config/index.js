// @ts-nocheck
import { fileURLToPath } from "url";
import path from 'path';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { Ajv } from 'ajv';
import * as schema from './config.schema.json' assert { type: "json" };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToConfig = path.join(__dirname, "..", "config.yaml");
const config = parse(readFileSync(pathToConfig, 'utf8'));
const ajv = new Ajv();
ajv.addSchema(schema, 'config');
if (!ajv.validate('config', config)) {
    console.error("Invalid config file", ajv.errors);
    process.exit(1);
}
export default config;
