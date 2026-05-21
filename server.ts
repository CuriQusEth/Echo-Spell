import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const TOOLS = [
  {
    name: 'get_race_status',
    description: '[PLACEHOLDER] Get current race status',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'start_race',
    description: '[PLACEHOLDER] Start a new race',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_leaderboard',
    description: '[PLACEHOLDER] Get the leaderboard',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'optimize_speed',
    description: '[PLACEHOLDER] Optimize speed capability',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_track_info',
    description: '[PLACEHOLDER] Get information about the track',
    inputSchema: { type: 'object', properties: {} }
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup CORS to allow external requests (required for MCP)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  app.use(express.json());

  app.get("/api/mcp", (req, res) => {
    res.json({ status: "MCP Server Active. Use POST for JSON-RPC." });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      
      if (body.method === 'initialize') {
        return res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {}, prompts: {}, resources: {} },
            serverInfo: { name: "Echo Spell Orchestrator", version: "1.0.0" }
          }
        });
      }

      if (body.method === 'tools/list') {
        return res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: { tools: TOOLS }
        });
      }

      if (body.method === 'tools/call') {
        const toolName = body.params?.name;
        const toolExists = TOOLS.some(t => t.name === toolName);

        if (toolExists) {
          return res.json({
            jsonrpc: "2.0",
            id: body.id,
            result: {
              content: [{ type: "text", text: `[PLACEHOLDER] Execution successful for ${toolName}` }],
              isError: false
            }
          });
        }
        
        return res.status(404).json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32601, message: `Tool not found: ${toolName}` }
        });
      }

      if (body.method === 'prompts/list') {
        return res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: { prompts: [] }
        });
      }

      if (body.method === 'resources/list') {
        return res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: { resources: [] }
        });
      }

      return res.status(400).json({
        jsonrpc: "2.0",
        id: body.id,
        error: { code: -32601, message: "Method not found" }
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON-RPC request format" });
    }
  });

  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Echo Spell Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Echo Spell",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
