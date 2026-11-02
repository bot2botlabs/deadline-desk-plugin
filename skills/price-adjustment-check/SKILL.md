---
name: price-adjustment-check
description: Check whether a US retailer refunds the difference when a price drops after purchase (price adjustment / price match), including holiday blackouts, with quoted store text. Use before Black Friday or Cyber Week purchases, or when the user asks "will they refund the difference if it goes on sale".
---

# Price adjustment check

Tool: `lookup_policy` with `kind: "price_adjustment"`.

## Data shape

Same lookup record as every Deadline Desk call, plus `price_adjustment_detail{ offered (bool), days, own_price_only (bool), exceptions[{label, window_start, window_end, note}], notes } | null`.

## Steps

1. Call `lookup_policy` with `{ "store": "<store>", "kind": "price_adjustment" }`.
2. Read `price_adjustment_detail.offered` first. If `false`, tell the user plainly the store doesn't adjust after purchase.
3. If offered, report `own_price_only` (whether it covers only the store's own price, not competitors) and `days`. When `days` is `null`, the window is tied to something else (often the return window); say so using `notes`.
4. List every `exceptions` entry that overlaps the user's purchase date, especially Thanksgiving-week competitor blackouts, before you give any yes/no.
5. Include the quote, `confidence`, and `receipt_url`.

## Example

`{ "store": "bestbuy", "kind": "price_adjustment" }` → `offered: true`, `own_price_only: true`, `days: null` (tied to the return window), exception "Competitor price match blackout (Thanksgiving week)" 2026-11-19 to 2026-11-30.

## Don't

- Don't promise a refund. The tool reports the published policy, not what a cashier will do.
- If `price_adjustment_detail` is `null`, fall back to the quote and `answer` only.
