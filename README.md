# Deadline Desk plugin (Agent Plugin)

US retail return, price adjustment, warranty, and cancellation policies with quoted store text and signed, public receipts.

- MCP: hosted Streamable HTTP at `https://deadline.bot2botlabs.com/mcp` (no key needed; see `mcp.json`)
- Tools: `lookup_policy`, `get_receipt`
- Skills: `return-deadline`, `price-adjustment-check`, `warranty-and-cancellation`, `verify-receipt`
- Docs: https://deadline.bot2botlabs.com/docs · demo receipts: https://deadline.bot2botlabs.com/docs/demo

Optional: a free `ddk_` key from https://deadline.bot2botlabs.com/onboard adds quota tracking. This plugin does not configure one and needs none.

`scripts/prove.mjs` (Node 22+, no dependencies) connects to the server in `mcp.json`, lists tools, and runs one call per skill.

## Install

Add this repo as an Agent Plugin, or add the MCP server directly: `https://deadline.bot2botlabs.com/mcp` (Streamable HTTP, no auth).

## Notes

- Answers report each store's published policy. They are informational, not legal advice, and a store may decide differently at the counter.
- Terms: https://deadline.bot2botlabs.com/terms · Privacy: https://deadline.bot2botlabs.com/privacy

## License

MIT. See `LICENSE`. This repo holds only the plugin manifest, skills and assets; the hosted server is separate.
