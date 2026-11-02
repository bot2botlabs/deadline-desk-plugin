---
name: warranty-and-cancellation
description: Look up a US retailer's published warranty terms or order/subscription cancellation rules, with the quoted policy text and a receipt. Use when the user asks "what's the warranty from <store>", "can I still cancel this order", or how to cancel at a supported retailer.
---

# Warranty and cancellation

Tool: `lookup_policy` with `kind: "warranty"` or `kind: "cancellation"`.

## Data shape

The standard lookup record: `answer`, `quote`, `official_url`, `source`, `verification_mirror{url, snapshot_timestamp} | null`, `checked_at`, `confidence`, `deadline_rule`, `receipt_id`, `receipt_url`.

## Steps

1. Pick the kind: `warranty` for coverage length or terms, `cancellation` for cancelling an order or plan.
2. Call `lookup_policy` with `{ "store": "<store>", "kind": "warranty" | "cancellation" }`.
3. Lead with the `quote` (the store's own words). Most warranty and cancellation pages don't state a day count, so `deadline_rule.last_day` is usually `null`. Don't compute a date the store didn't publish.
4. When `source` is `curated`, mention `checked_at` and that the text came from a saved copy (`verification_mirror.url`), not a live fetch.
5. Give the user `official_url` for the action itself (for example, cancelling in Your Orders) and `receipt_url` for verification.

## Examples

- `{ "store": "apple", "kind": "warranty" }` → quote "…come with a one-year limited warranty.", `source: curated`.
- `{ "store": "amazon", "kind": "cancellation" }` → quote "You can cancel items or orders that haven't entered the shipping process…".

## Scope

These are retailer policies. For a brand or manufacturer warranty, say this tool doesn't cover it.
