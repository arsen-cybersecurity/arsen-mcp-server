<div align="center">
  <img src="assets/arsen-mark.svg" alt="Arsen" width="64" height="64">

  # Arsen MCP

  **Bring your Arsen security awareness data into an AI assistant.**

  [Connect to Arsen](https://app.arsen.co/mcp) · [Server endpoint](https://api.arsen.co/mcp) · [Support](https://support.arsen.co)
</div>

Arsen MCP is a **hosted** Model Context Protocol (MCP) service. It lets an MCP-compatible assistant use the Arsen capabilities available to your account, such as exploring simulation campaigns and their results. You connect your client to Arsen's HTTPS endpoint and authorize access with your Arsen account. There is no server in this repository to run or deploy.

This repository is the public connection and discovery guide for the service. It does not contain Arsen's backend or give access to an organization by itself.

## Connect

**Server URL:** `https://api.arsen.co/mcp`

**Transport:** Streamable HTTP

1. Sign in to [Arsen](https://app.arsen.co/mcp) and open **MCP**. Your Arsen account must have access to the organization and data you want to use.
2. In your AI client, add a **remote/custom MCP server** with the URL above.
3. Choose **OAuth** or browser sign-in when your client offers it. Review the permissions on Arsen's consent screen, then approve the connection.
4. In the client, inspect the tools it discovered and try a read-only question. Tool availability depends on the access granted to your account and the service's current deployment.

Client menus and account requirements change. These are starting points from the clients' own documentation, not a claim that every client/version has completed Arsen-specific interoperability testing:

| Client | Where to add the server | Client documentation |
| --- | --- | --- |
| Claude | **Customize → Connectors → Add custom connector**; enter the Arsen URL and connect with your Arsen account. Team and Enterprise owners may need to add the connector for their organization first. | [Custom remote MCP connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) |
| Claude Code | Run `claude mcp add --transport http --scope user arsen https://api.arsen.co/mcp`, then authorize Arsen when prompted. | [Claude Code MCP guide](https://code.claude.com/docs/en/mcp) |
| Cursor | Add a remote **Streamable HTTP** server in MCP settings, or use a global/project `mcp.json` configuration. Complete OAuth when prompted. | [Cursor MCP guide](https://cursor.com/docs/mcp) |
| VS Code / GitHub Copilot | Run **MCP: Add Server**, choose **HTTP**, enter the URL, and select where the configuration belongs. Sign in when prompted. | [Add MCP servers in VS Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers) |
| ChatGPT | In a workspace that allows custom MCP servers, go to **Plugins → Add custom MCP server**, enter the public HTTPS URL, select OAuth, and review the discovered tools. Workspace permissions and plan requirements apply. | [Connect custom MCP servers](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) |
| Gemini CLI | Run `gemini mcp add --transport http --scope user arsen https://api.arsen.co/mcp`, then complete OAuth when prompted. | [Gemini CLI MCP guide](https://geminicli.com/docs/tools/mcp-server/) |

## Client packages in this repository

The root `plugin.json` and `mcp.json` form an [Agent Plugins](https://agent-plugins.org/) package for clients that support that format. Cursor and Claude Code use their own plugin manifests with the shared `.mcp.json` connection. `gemini-extension.json` is a Gemini CLI extension, and `server.json` is MCP Registry metadata. All connection files point to the same hosted endpoint; none starts a local server or contains credentials. Installing a package still requires client support and Arsen authorization.

For a client that accepts a URL but does not offer OAuth, open **MCP → Other** in Arsen for its manual setup instructions. That flow provides a bearer token for an `Authorization: Bearer …` header. A manual token can authorize write-capable tools, subject to your Arsen permissions and the tools actually exposed to your session. Treat it as a secret: keep it out of chat messages, shared configuration files, screenshots, and support tickets. Prefer OAuth when your client supports it.

## What you can ask

Start with a question that names Arsen and lets the assistant ask you to choose an organization. For example:

> Using Arsen, ask me which organization to use. Then find a recent simulation campaign and summarize its status, audience, outcomes, and notable results.

> Using Arsen, ask me for an organization and reporting period. Review its simulation results, explain what needs attention, and cite the figures behind each finding.

These are example requests, not a guarantee that every client or account exposes the same tools or fields. After connecting, your client discovers the tools available to **your** session. The [live server card](https://api.arsen.co/mcp/server-card) and [MCP setup guide](https://api.arsen.co/mcp/llms.txt) provide service metadata; the authenticated MCP `tools/list` response is the source of truth for tools your session can call. Some actions may require additional Arsen permissions or may be unavailable in the current deployment. Review any proposed write action before approving it in your client.

## Access, revocation, and audit

- **OAuth connections:** The Arsen consent screen shows the access requested by the client. Data remains subject to your Arsen account's permissions. Disconnect the connector in your client when you no longer need it. For Arsen-side grant revocation or access review, contact your Arsen administrator or [Arsen Support](https://support.arsen.co).
- **Manual bearer tokens:** In Arsen's **MCP → Other** setup, use **Replace token** to revoke the current manual token and issue a replacement. Update any client that still needs access. Replacing a manual token does not change existing OAuth grants.
- **Audit questions:** Ask your Arsen administrator or [Arsen Support](https://support.arsen.co) for the audit records and retention details that apply to your organization. Do not assume that the AI client's own conversation history is an Arsen audit log.

Only connect a client you trust with the data it may receive. Review the Arsen consent screen and the client's tool-call approvals. A client may send tool inputs and returned data to its own service under that client's terms.

## Service identity and versions

The MCP server identity (`co.arsen/social-engineering`), its MCP server version, and Arsen's backend release version describe different things. They are not interchangeable. Check the [live server card](https://api.arsen.co/mcp/server-card) for the current MCP identity and server version; backend releases are tracked separately. This repository documents the hosted service; a Git tag or commit here does not deploy a backend release.

## Validate repository manifests

If you change a client manifest or registry metadata in this repository, run `npm run check` before opening a pull request. The check validates the tracked manifest shapes and that they point to Arsen's canonical endpoint. It does not test authentication, client installation, or the live tool catalog.

## Help and security reports

For connection or account-access help, use [Arsen Support](https://support.arsen.co). For a security issue, follow [SECURITY.md](SECURITY.md) and do not include credentials or organization data in a public issue. Documentation corrections and client setup feedback are welcome through this repository's issues.
