type VercelRequest = {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
  [key: string]: any;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => any;
  status: (code: number) => { json: (data: any) => any; end: () => any };
  json: (data: any) => any;
  end: () => any;
};

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: "MCP Server Active. Use POST for JSON-RPC." });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body.method === 'initialize') {
        return res.status(200).json({
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
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id,
          result: { tools: TOOLS }
        });
      }

      if (body.method === 'tools/call') {
        const toolName = body.params?.name;
        const toolExists = TOOLS.some(t => t.name === toolName);

        if (toolExists) {
          return res.status(200).json({
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
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id,
          result: { prompts: [] }
        });
      }

      if (body.method === 'resources/list') {
        return res.status(200).json({
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
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON-RPC request format" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
