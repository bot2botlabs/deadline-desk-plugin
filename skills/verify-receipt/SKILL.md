---
name: verify-receipt
description: Fetch and check a Deadline Desk receipt (ddr_… or dd-… ID) to show which store page and quote an answer came from and whether the record is signed and unchanged. Use when the user or another agent asks "where did that come from", "prove it", or shares a receipt ID or receipt URL.
---

# Verify a receipt

Tool: `get_receipt` (read-only) on the `deadline-desk` MCP server.

## Data shape

Format v1 receipt: `{ format: "deadline-desk/receipt", format_version: 1, receipt_id, issued_at, receipt_type (claim|correction), corrects, claim{type, answer, quote, confidence, body}, evidence[{role, url, retrieval, checked_at, content_hash, snapshot{url, content_hash}}], attestation{level: "software-only", hardware_attested: false}, trace{record{…Ed25519 signed TRACE v0.2…}, signature} }`. IDs starting with `dd-` are older format v0 log entries.

## Steps

1. Take the ID from a prior lookup (`receipt_id`) or from a `/receipts/{id}` URL.
2. Call `get_receipt` with `{ "receipt_id": "<id>" }`.
3. Show the user: `claim.answer`, `claim.quote`, `evidence[0].url` with `checked_at`, and the `evidence[0].snapshot.url` (the saved page copy the quote was matched against).
4. If `receipt_type` is `correction`, say which receipt it corrects (`corrects`).
5. For a full signature check, point the user to the dependency-free verifier: `curl -O https://deadline.bot2botlabs.com/verify-receipt.mjs && node verify-receipt.mjs <receipt_id>` (prints VALID / NOT VALID / INCOMPLETE). Only run it yourself if you have a shell and the user asked.

## Be honest about what it proves

A valid receipt proves who signed it (Bot2Bot Labs' published key) and that it hasn't changed since. It is software-only, not hardware-attested, and it doesn't prove the store will honor the policy.

`get_receipt` is rate limited (about 60 a minute per client). On `rate_limited`, wait for `retry_after`.
