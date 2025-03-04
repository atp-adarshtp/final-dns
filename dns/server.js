require("dotenv").config();
const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const HETZNER_API = "https://dns.hetzner.com/api/v1"; // Direct Hetzner API
const HETZNER_API_KEY = "GTa1hdQLmCuys8oWOxLebMqUAuCWk5E7"; // Replace with your API key

// Enable CORS
app.use(cors());

// Middleware to set API headers
const proxyMiddleware = (urlPath) => {
  return proxy(HETZNER_API, {
    proxyReqPathResolver: () => urlPath,
    proxyReqOptDecorator: (proxyReqOpts) => {
      proxyReqOpts.headers["Auth-API-Token"] = HETZNER_API_KEY;
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
  });
};

// ✅ Route 1: Fetch a Single Record by ID
app.use("/api/v1/records/:record_id", (req, res) => {
  const recordId = req.params.record_id;

  if (!recordId) {
    return res.status(400).json({ error: "record_id is required" });
  }

  // Hetzner API path for a single record
  const hetznerRecordPath = `/api/v1/records/${recordId}`;
  
  proxyMiddleware(hetznerRecordPath)(req, res);
});

// ✅ Route 2: Fetch All Records for a Zone
app.use("/api/v1/records", (req, res) => {
  const zoneId = req.query.zone_id;

  if (!zoneId) {
    return res.status(400).json({ error: "zone_id is required" });
  }

  // Hetzner API path for all records in a zone
  const hetznerRecordsPath = `/api/v1/records?zone_id=${zoneId}`;
  
  proxyMiddleware(hetznerRecordsPath)(req, res);
});

// ✅ Route 3: Fetch All Zones
app.use("/api/v1/zones", proxyMiddleware("/api/v1/zones"));

// Default Route
app.get("/", (req, res) => {
  res.send("Hetzner API Proxy is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
