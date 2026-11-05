import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const endpoint = 'https://api.arsen.co/mcp';
const files = [
  'server.json',
  'plugin.json',
  'mcp.json',
  '.mcp.json',
  '.cursor-plugin/plugin.json',
  '.claude-plugin/plugin.json',
  'gemini-extension.json',
];

function readJson(file) {
  return JSON.parse(readFileSync(new URL(file, root), 'utf8'));
}

function requireKeys(value, keys, label) {
  assert.equal(typeof value, 'object', `${label} must be an object`);
  assert.ok(value !== null && !Array.isArray(value), `${label} must be an object`);
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label} has unexpected fields`);
}

function requireEndpoint(value, label) {
  assert.equal(value, endpoint, `${label} must use the hosted MCP endpoint`);
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${label} must use HTTPS`);
  assert.equal(url.username, '', `${label} must not contain credentials`);
  assert.equal(url.password, '', `${label} must not contain credentials`);
  assert.equal(url.search, '', `${label} must not contain a query string`);
  assert.equal(url.hash, '', `${label} must not contain a fragment`);
}

function requireRemoteOnly(value, label) {
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!['command', 'args', 'env', 'headers', 'packages', 'variables'].includes(key),
      `${label}.${key} would introduce a local process or credential configuration`);
    if (child && typeof child === 'object') requireRemoteOnly(child, `${label}.${key}`);
  }
}

for (const file of files) requireRemoteOnly(readJson(file), file);

const registry = readJson('server.json');
assert.equal(registry.$schema, 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json');
assert.equal(registry.name, 'co.arsen/social-engineering');
assert.match(registry.version, /^\d+\.\d+\.\d+$/);
assert.equal(registry.remotes.length, 1);
requireKeys(registry.remotes[0], ['type', 'url'], 'server.json remotes[0]');
assert.equal(registry.remotes[0].type, 'streamable-http');
requireEndpoint(registry.remotes[0].url, 'server.json');

const portableConfig = readJson('mcp.json');
requireKeys(portableConfig, ['$schema', 'mcpServers'], 'mcp.json');
assert.equal(portableConfig.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
requireKeys(portableConfig.mcpServers, ['arsen'], 'mcp.json mcpServers');
requireKeys(portableConfig.mcpServers.arsen, ['type', 'url'], 'mcp.json arsen');
assert.equal(portableConfig.mcpServers.arsen.type, 'streamable-http');
requireEndpoint(portableConfig.mcpServers.arsen.url, 'mcp.json');

const portablePlugin = readJson('plugin.json');
assert.equal(portablePlugin.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert.equal(portablePlugin.name, 'arsen');
assert.equal(portablePlugin.repository, 'https://github.com/arsen-cybersecurity/arsen-mcp-server');

const claudeConfig = readJson('.mcp.json');
requireKeys(claudeConfig, ['mcpServers'], '.mcp.json');
requireKeys(claudeConfig.mcpServers, ['arsen'], '.mcp.json mcpServers');
requireKeys(claudeConfig.mcpServers.arsen, ['type', 'url'], '.mcp.json arsen');
assert.equal(claudeConfig.mcpServers.arsen.type, 'http');
requireEndpoint(claudeConfig.mcpServers.arsen.url, '.mcp.json');

for (const file of ['.cursor-plugin/plugin.json', '.claude-plugin/plugin.json']) {
  const plugin = readJson(file);
  assert.equal(plugin.name, 'arsen', `${file} plugin name`);
  assert.match(plugin.version, /^\d+\.\d+\.\d+$/, `${file} plugin version`);
  assert.equal(plugin.repository, 'https://github.com/arsen-cybersecurity/arsen-mcp-server');
  assert.equal(plugin.mcpServers, './.mcp.json', `${file} must use the shared remote connection`);
}
assert.ok(existsSync(new URL(readJson('.cursor-plugin/plugin.json').logo, root)), 'Cursor logo path is missing');

const gemini = readJson('gemini-extension.json');
assert.equal(gemini.name, 'arsen');
assert.match(gemini.version, /^\d+\.\d+\.\d+$/);
requireKeys(gemini.mcpServers, ['arsen'], 'gemini-extension.json mcpServers');
requireKeys(gemini.mcpServers.arsen, ['httpUrl'], 'gemini-extension.json arsen');
requireEndpoint(gemini.mcpServers.arsen.httpUrl, 'gemini-extension.json');

// Check repository links without relying on external sites or live credentials.
const readme = readFileSync(new URL('README.md', root), 'utf8');
const withoutFences = readme.replace(/^```[\s\S]*?^```/gm, '');
for (const match of withoutFences.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
  const target = match[1].split('#', 1)[0].trim();
  if (!target || /^(?:[a-z]+:|\/\/)/i.test(target)) continue;
  assert.ok(existsSync(new URL(target, root)), `README.md has a broken local link: ${match[1]}`);
}

console.log(`Structurally validated ${files.length} hosted MCP manifests and local README links.`);
