// controllers/sseController.js

const SSE_SOURCE_BASE = "https://top11.info/Superadmin/get_data_event";
const FETCH_TIMEOUT_MS = 10000; // 10 seconds to establish connection
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Proxy a Server-Sent Events stream from the upstream source.
 * Falls back to a polling-based JSON response if SSE is unavailable.
 */
async function proxySSE(req, res) {
  const { matchId } = req.params;

  if (!matchId) {
    return res.status(400).json({ error: "matchId is required" });
  }

  const targetUrl = `${SSE_SOURCE_BASE}/${matchId}`;

  // ── Set SSE headers immediately so the client knows it's a stream ──
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable Nginx buffering if present
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Flush headers to client right away
  res.flushHeaders?.();

  // ── Helper: send a named SSE event ──
  const sendEvent = (eventName, data) => {
    try {
      if (eventName) res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // Client disconnected mid-write — ignore
    }
  };

  // ── Helper: send a heartbeat to keep connection alive ──
  let heartbeatTimer = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeatTimer);
    }
  }, 20000);

  // ── Cleanup on client disconnect ──
  let upstreamReader = null;
  const cleanup = () => {
    clearInterval(heartbeatTimer);
    try {
      upstreamReader?.cancel();
    } catch {
      // already closed
    }
  };
  req.on("close", cleanup);
  req.on("end", cleanup);

  // ── Attempt upstream SSE with retries ──
  let attempt = 0;
  while (attempt < MAX_RETRY_ATTEMPTS) {
    attempt++;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const upstream = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
      clearTimeout(timeoutId);

      if (!upstream.ok) {
        throw new Error(`Upstream returned HTTP ${upstream.status}`);
      }

      if (!upstream.body) {
        throw new Error("No readable body from upstream");
      }

      // ── Stream upstream → client ──
      upstreamReader = upstream.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await upstreamReader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Pass raw SSE chunk straight through
        try {
          res.write(chunk);
        } catch {
          // Client disconnected
          break;
        }
      }

      // Stream ended naturally
      cleanup();
      res.end();
      return;
    } catch (err) {
      console.error(`[SSE] Attempt ${attempt} failed for matchId=${matchId}:`, err.message);

      if (attempt < MAX_RETRY_ATTEMPTS) {
        // Notify client of retry
        sendEvent("retry", {
          message: `Connection attempt ${attempt} failed. Retrying…`,
          attempt,
        });
        await delay(1500 * attempt); // progressive back-off
      }
    }
  }

  // ── All retries exhausted — send fallback error event then close ──
  sendEvent("error", {
    message: "Unable to connect to live data source after multiple attempts.",
    matchId,
    fallback: true,
  });
  cleanup();
  res.end();
}

/**
 * Health-check / fallback endpoint: returns last-known static data
 * for a match (or an empty shell) so the frontend can degrade gracefully.
 */
async function getMatchFallback(req, res) {
  const { matchId } = req.params;

  try {
    // Attempt a plain HTTP fetch (non-streaming) as best-effort
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const upstream = await fetch(
      `${SSE_SOURCE_BASE}/${matchId}`,
      { signal: controller.signal }
    );

    if (!upstream.ok) throw new Error(`HTTP ${upstream.status}`);

    const text = await upstream.text();

    // Try to extract the last JSON array from the SSE text
    const jsonMatch = text.match(/data:\s*(\[[\s\S]*?\])/);
    if (jsonMatch) {
      return res.json({ ok: true, data: JSON.parse(jsonMatch[1]) });
    }

    return res.json({ ok: false, data: [], message: "No parseable data" });
  } catch (err) {
    console.error("[Fallback] Error:", err.message);
    return res.status(503).json({
      ok: false,
      data: [],
      message: "Live data unavailable. Please try again later.",
    });
  }
}

// ── Utility ──────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { proxySSE, getMatchFallback };