# Contributing

This repository is the public documentation and client-configuration surface for the Arsen-hosted MCP service. It does not accept server implementation code.

## Before opening a pull request

- Keep examples and manifests free of tokens, secrets, customer data, and internal endpoints.
- Check client installation and manifest claims against the current client specifications. Link the source in the pull request when a client flow or schema changes.
- Check Arsen endpoint, tool, permission, and security claims against the running service or an approved product source. State any unverified claim in the pull request instead of publishing it as fact.
- Run the repository validation command documented in the README.
- Route security findings privately as described in [SECURITY.md](SECURITY.md).

## Review and ownership

Arsen maintainers review changes to public documentation, manifests, and branded assets before merging. A maintainer should check that the proposed text matches the hosted service and that every install path still works. Registry identity and version changes also need review from the team responsible for the official MCP Registry entry. Release and marketplace submissions remain maintainer actions.
