---
name: return-deadline
description: Find the last day to return something bought at a US retailer, with the store's quoted policy and holiday exceptions. Use when the user asks "can I still return this", "when is the return deadline", or about holiday/January return-by dates at Target, Amazon, Walmart, Best Buy, Apple, Costco, and other supported stores.
---

# Return deadline

Tool: `lookup_policy` on the `deadline-desk` MCP server, with `kind: "return"`.

## Data shape (what comes back)

One policy lookup = `{ store, store_display, kind, answer, deadline_rule{anchor, days, last_day, notes}, quote, official_url, source (live|curated|archive), checked_at, content_hash, confidence (high|medium|low|unknown), holiday_extended_return{policy_year, purchase_window, return_by, exceptions[], reverts_to, source} | null, receipt_id, receipt_url }`.

## Steps

1. Get the store (slug like `target` or a domain like `target.com`) and, if the user has it, the purchase or delivery date.
2. Call `lookup_policy` with `{ "store": "<store>", "kind": "return", "anchor_date": "<YYYY-MM-DD>", "as_of": "<today YYYY-MM-DD>" }`. Leave `anchor_date` out if you don't know it; never guess one.
3. If `holiday_extended_return` is present and the purchase date falls inside `purchase_window`, read `exceptions` **first**. Categories such as Apple products or phones often have an earlier date than the headline `return_by`.
4. Otherwise use `deadline_rule.last_day`. If it is `null` or `confidence` is `unknown`, say the store's page doesn't state a computable window and show the quote. Do not invent a day count.
5. Answer with: the date, the exception that applies (if any), the quoted store text, `source` and `checked_at`, and `receipt_url` so the user can check the work.

## Example

`{ "store": "target", "kind": "return", "anchor_date": "2026-11-02", "as_of": "2026-11-02" }` → `deadline_rule.last_day: 2027-01-31` (90 days), plus a 2026 holiday overlay where Apple/Beats/phones are due `2027-01-08`.

## Notes

- 25 stores are supported; the list is at https://deadline.bot2botlabs.com/api/v1/stores.
- No API key is needed. Each lookup issues a public receipt, so don't put personal details in arguments (there is no field for them anyway).
