<div align="center">
  <img src="assets/arsen-mark.svg" alt="Arsen" width="64" height="64">

  # Arsen MCP

  [Open MCP in Arsen](https://app.arsen.co/mcp) · [Help](https://support.arsen.co)
</div>

Use Arsen MCP to ask an AI assistant about the simulation and training data your Arsen account can access. Arsen hosts the server. This repository holds connection instructions and client manifests; there is nothing to run locally.

## Connect

The server URL is `https://api.arsen.co/mcp` (Streamable HTTP).

1. Open [MCP in Arsen](https://app.arsen.co/mcp). You need access to an Arsen organization.
2. Add a remote HTTP MCP server in your client using the URL above. Choose OAuth if the client offers it, then sign in and approve the Arsen consent screen.
3. Refresh the connection and try a read-only question about an organization you can access.

| Client | Setup |
| --- | --- |
| Claude | Add a [custom connector](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) using the server URL. |
| ChatGPT | Use [Plugins → Add custom MCP server](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) if your workspace allows it. |
| Cursor | Add the server in [MCP settings](https://cursor.com/docs/mcp). |
| VS Code / GitHub Copilot | Run [MCP: Add Server](https://code.visualstudio.com/docs/agent-customization/mcp-servers) and choose HTTP. |
| Claude Code | Run `claude mcp add --transport http --scope user arsen https://api.arsen.co/mcp`, then sign in through `/mcp`. [Guide](https://code.claude.com/docs/en/mcp) |
| Gemini CLI | Run `gemini mcp add --transport http --scope user arsen https://api.arsen.co/mcp`, then run `/mcp auth arsen`. [Guide](https://geminicli.com/docs/tools/mcp-server/) |

Custom MCP connections can depend on your plan or workspace settings.

If your client cannot use OAuth, open **MCP → Other** in Arsen for manual token setup. Keep the token in your client's private configuration; do not paste it into chat or commit it. Manual tokens may allow changes as well as reads, depending on your Arsen permissions.

## Try it

> Using Arsen, ask me which organization to use. Then summarize a recent simulation campaign and its results.

> Using Arsen, compare simulation results for my organization over the last month. Show the figures behind your conclusions.

Your client gets its available tools through MCP `tools/list`. The list depends on your Arsen access and the tools currently deployed. The [server card](https://api.arsen.co/mcp/server-card) shows the service identity and version.

## Access and revocation

OAuth connections use the scopes you approve and your existing Arsen permissions. Disconnect the connection in your client when you no longer need it. To revoke access from Arsen or request audit records, ask your administrator or contact [Arsen Support](https://support.arsen.co).

For a manual token, use **Replace token** under **MCP → Other** in Arsen to revoke it. Update any client that still needs access. Your AI client may receive Arsen data when a tool runs, so review its data policy before connecting.

## For maintainers

`server.json` holds MCP Registry metadata. Its version tracks the MCP server, separately from Arsen's backend release and the MCP protocol version. `plugin.json` and `mcp.json` form an [Agent Plugins](https://agent-plugins.org/) package. Cursor and Claude Code share `.mcp.json`; Gemini CLI uses `gemini-extension.json`.

After changing a client connection, test sign-in and a read-only tool call in that client.

For setup help, use [Arsen Support](https://support.arsen.co). Report security issues privately using [SECURITY.md](SECURITY.md).
