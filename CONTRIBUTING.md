# Contributing

This repository documents the Arsen-hosted MCP service and packages client connections. The server code lives elsewhere.

For a documentation or manifest change:

1. Check client instructions against the client's current documentation. Check Arsen tool, access, and endpoint claims against the running service or an approved product source. Link your source in the pull request.
2. Keep tokens, customer data, and internal URLs out of examples. Report security issues privately through [SECURITY.md](SECURITY.md).
3. Run `npm ci`, `npm run check`, and `npm run check:schemas`. If you changed a client setup path, say which client you tested and what you could not test.

Ask an Arsen maintainer to review public claims and installation changes before merging. Changes to `server.json` also need review from the team that publishes the MCP Registry entry.
