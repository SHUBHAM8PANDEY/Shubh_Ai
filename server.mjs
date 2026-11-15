import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

const topics = {
  site: "SHUBH AI is Shubham Pandey’s independent portfolio and AI education site. It has an AI learning guide, an application catalog, a journal, and a browser text analyzer.",
  developer: "Shubham Pandey is a full stack developer in Gorakhpur, Uttar Pradesh, India. His projects and downloadable resume are on the Portfolio page.",
  contact: "Contact Shubham Pandey at shubhamgkpp@gmail.com or +91 8953620607. See the Contact page for current form availability.",
  projects: "The Portfolio page showcases the SHUBH AI website and its browser-based text analyzer. The AI Learning page has 29 educational application examples.",
};
const types = { ".pdf": "application/pdf", ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
const cache = new Map();
let day = "";
let calls = 0;
let pending = false;
function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}
async function chat(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` &&
    req.headers.origin !== `https://${req.headers.host}`) return json(res, 403, { error: "Use the site chat." });
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > 256) return json(res, 413, { error: "Request too long." });
  }
  let topic;
  try { ({ topic } = JSON.parse(body)); } catch { return json(res, 400, { error: "Invalid request." }); }
  if (typeof topic !== "string" || !Object.hasOwn(topics, topic)) return json(res, 400, { error: "Choose a SHUBH AI topic." });
  if (cache.has(topic)) return json(res, 200, { answer: cache.get(topic), source: "Groq" });
  const fallback = () => json(res, 200, { answer: topics[topic], source: "Site guide" });
  const today = new Date().toISOString().slice(0, 10);
  if (day !== today) { day = today; calls = 0; }
  if (!process.env.GROQ_API_KEY || calls >= 12 || pending) return fallback();
  calls++;
  pending = true;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        max_completion_tokens: 180,
        reasoning_effort: "low",
        messages: [{ role: "system", content: "Rewrite the supplied SHUBH AI facts in one or two short sentences. Preserve contact details verbatim. Add no claims." },
          { role: "user", content: topics[topic] }],
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return fallback();
    const answer = (await response.json()).choices?.[0]?.message?.content?.trim();
    if (!answer || answer.length > 650) return fallback();
    cache.set(topic, answer);
    return json(res, 200, { answer, source: "Groq" });
  } catch {
    return fallback();
  } finally {
    pending = false;
  }
}

createServer(async (req, res) => {
  try {
    const route = new URL(req.url, "http://localhost").pathname.replace(/^\/SHUBH-AI(?=\/)/, "");
    if (route === "/api/chat") return await chat(req, res);
    const file = route === "/" ? "/index.html" : route;
    if (!["GET", "HEAD"].includes(req.method) ||
        !/^\/(?:[a-z-]+\.html|assets\/[a-z0-9-]+\.(?:css|js|jpg|png|svg|pdf))$/.test(file)) return json(res, 404, { error: "Page unavailable." });
    const data = await readFile(new URL(`.${file}`, import.meta.url));
    res.writeHead(200, { "Content-Type": types[extname(file)], "X-Content-Type-Options": "nosniff" });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    if (!res.headersSent) json(res, 404, { error: "Page unavailable." });
  }
}).listen(process.env.PORT || 8080, process.env.HOST || "127.0.0.1");
