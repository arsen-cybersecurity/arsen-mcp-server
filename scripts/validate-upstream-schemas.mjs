import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = new URL('../', import.meta.url);
const sources = [
  {
    file: 'server.json',
    url: 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
  },
  {
    file: '.cursor-plugin/plugin.json',
    url: 'https://raw.githubusercontent.com/cursor/plugins/5229aad76c37451561c5b81a9b5072ae1c549a5b/schemas/plugin.schema.json',
  },
  {
    file: 'plugin.json',
    url: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
    dialect: '2020',
  },
  {
    file: 'mcp.json',
    url: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
    dialect: '2020',
  },
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const ajv2020 = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv2020);

for (const { file, url, dialect } of sources) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    throw new Error(`Could not fetch upstream schema for ${file} from ${url}`, { cause: error });
  }
  assert.ok(response.ok, `Could not fetch upstream schema for ${file}: HTTP ${response.status}`);
  const schema = await response.json();
  const validator = dialect === '2020' ? ajv2020 : ajv;
  const validate = validator.compile(schema);
  const manifest = JSON.parse(readFileSync(new URL(file, root), 'utf8'));
  assert.ok(validate(manifest), `${file} failed ${url}: ${validator.errorsText(validate.errors)}`);
  console.log(`Validated ${file} against ${url}`);
}
