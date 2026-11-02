// Zero-dep proof harness: reads the plugin's mcp.json, talks Streamable HTTP
// JSON-RPC to the configured server, lists tools, and runs one core call per skill.
// No API key is sent (hosted lookup_policy is free without one).
import { readFileSync } from "node:fs";
const root = new URL("..", import.meta.url);
const cfg = JSON.parse(readFileSync(new URL("mcp.json", root)));
const server = cfg.mcpServers["deadline-desk"];
const url = server.url;
let id = 0, session;
async function rpc(method, params) {
  const headers = { "content-type": "application/json", accept: "application/json, text/event-stream" };
  if (session) headers["mcp-session-id"] = session;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) });
  session = res.headers.get("mcp-session-id") ?? session;
  const text = await res.text();
  const data = text.includes("data:") ? text.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5)).pop() : text;
  return { status: res.status, body: JSON.parse(data) };
}
const out = [];
const log = (k, v) => { out.push({ step: k, ...v }); };
const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "deadline-desk-plugin-proof", version: "0.1.0" } });
log("initialize", { http: init.status, server: init.body.result?.serverInfo?.name, version: init.body.result?.serverInfo?.version, protocol: init.body.result?.protocolVersion });
await fetch(url, { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream", ...(session ? { "mcp-session-id": session } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) });
const tl = await rpc("tools/list", {});
log("tools/list", { http: tl.status, tools: tl.body.result?.tools?.map(t => t.name) });
const calls = [
  ["return-deadline", "lookup_policy", { store: "target", kind: "return", as_of: "2026-11-02", anchor_date: "2026-11-02" }],
  ["price-adjustment-check", "lookup_policy", { store: "bestbuy", kind: "price_adjustment" }],
  ["warranty-and-cancellation (warranty)", "lookup_policy", { store: "apple", kind: "warranty" }],
  ["warranty-and-cancellation (cancellation)", "lookup_policy", { store: "amazon", kind: "cancellation" }],
];
let firstReceipt;
for (const [skill, tool, args] of calls) {
  const r = await rpc("tools/call", { name: tool, arguments: args });
  const res = r.body.result; const isError = !!(res?.isError || r.body.error);
  let payload = res?.structuredContent;
  if (!payload) { try { payload = JSON.parse(res?.content?.[0]?.text); } catch { payload = res?.content?.[0]?.text ?? r.body.error; } }
  firstReceipt ??= payload?.receipt_id;
  log(`${skill}: ${tool}`, { args, http: r.status, isError, payload });
}
const g = await rpc("tools/call", { name: "get_receipt", arguments: { receipt_id: firstReceipt } });
let gp = g.body.result?.structuredContent; if (!gp) { try { gp = JSON.parse(g.body.result?.content?.[0]?.text); } catch { gp = g.body.result?.content?.[0]?.text ?? g.body.error; } }
log("verify-receipt: get_receipt", { args: { receipt_id: firstReceipt }, http: g.status, isError: !!(g.body.result?.isError || g.body.error), payload: gp });
console.log(JSON.stringify({ url, ran_at: new Date().toISOString(), steps: out }, null, 2));
