const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

router.get("/search", async (req, res) => {
  const q = String(req.query.q || req.query.query || "").trim();
  if (!q) return res.status(400).json({ status: false, error: "Missing song query. Use ?q=song name" });
  if (q.length > 180) return res.status(400).json({ status: false, error: "Search query is too long." });

  try {
    const url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(q + " official audio");
    const response = await axios.get(url, {
      timeout: 12000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    const html = response.data;
    const match = html.match(/ytInitialData\s*=\s*(\{.*?\});\s*<\/script>/s);
    const results = [];
    if (match) {
      const data = JSON.parse(match[1]);
      const walk = (node) => {
        if (!node || typeof node !== "object" || results.length >= 15) return;
        if (node.videoRenderer) {
          const v = node.videoRenderer;
          const videoId = v.videoId;
          const title = (v.title?.runs || []).map(x => x.text).join("");
          const channel = (v.ownerText?.runs || v.shortBylineText?.runs || []).map(x => x.text).join("");
          const duration = v.lengthText?.simpleText || "";
          if (videoId && title) results.push({
            title, channel, duration,
            url: "https://www.youtube.com/watch?v=" + videoId,
            thumbnail: "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg"
          });
        }
        for (const value of Object.values(node)) {
          if (value && typeof value === "object") Array.isArray(value) ? value.forEach(walk) : walk(value);
        }
      };
      walk(data);
    }
    return res.json({
      status: true, creator: "Madusanka", project: "CRIMINAL API",
      query: q, count: results.length, result: results,
      note: "Results link to YouTube. Use official or rights-authorized services for listening and downloads."
    });
  } catch (err) {
    return res.status(502).json({
      status: false, error: "Song search source is temporarily unavailable.",
      detail: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

module.exports = router;
