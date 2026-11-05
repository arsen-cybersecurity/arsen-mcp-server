# Manifest validation

Run `npm ci`, then `npm run check` for deterministic local checks. This parses all six manifests, verifies that every client uses the same HTTPS hosted endpoint without embedded credentials or a local launch command, and checks local links in the repository README.

Run `npm run check:schemas` to validate against upstream JSON Schemas. This check needs network access and fails clearly if either source cannot be fetched:

| Manifest | Published schema | Pin |
| --- | --- | --- |
| `server.json` | [MCP Registry server schema](https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json) | `2025-12-11` |
| `.cursor-plugin/plugin.json` | [Cursor plugin schema](https://github.com/cursor/plugins/blob/5229aad76c37451561c5b81a9b5072ae1c549a5b/schemas/plugin.schema.json) | `5229aad76c37451561c5b81a9b5072ae1c549a5b` |

No upstream schema is copied into this repository. Claude Code and Gemini CLI do not publish standalone JSON Schemas for these plugin manifests in their current [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference) and [Gemini extension reference](https://geminicli.com/docs/extensions/reference/). Their documented fields are checked locally. Where Claude Code is installed, `claude plugin validate .` additionally checks the Claude plugin and its `.mcp.json` connection; this passed during preparation. Gemini's `httpUrl` field is documented in its [MCP server configuration](https://geminicli.com/docs/tools/mcp-server/).

Client installation and OAuth login require hands-on testing before marketplace publication.
