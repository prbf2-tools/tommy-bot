import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { Ajv } from 'ajv';
import * as schema from './config.schema.json';
const config = parse(readFileSync('../config.yaml', 'utf8'));
const ajv = new Ajv();
ajv.addSchema(schema, 'config');
if (!ajv.validate('config', config)) {
    console.error("Invalid config file", ajv.errors);
    process.exit(1);
}
export default config;
