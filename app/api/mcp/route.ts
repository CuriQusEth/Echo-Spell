import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    { status: "MCP Server Active. Use POST for JSON-RPC." },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle JSON RPC 2.0 requests
    if (body.method === 'initialize') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: { name: "Echo Spell Orchestrator", version: "1.0.0" }
        }
      }, { headers: CORS_HEADERS });
    }

    if (body.method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: TOOLS }
      }, { headers: CORS_HEADERS });
    }

    if (body.method === 'tools/call') {
      const toolName = body.params?.name;
      const toolExists = TOOLS.some(t => t.name === toolName);

      if (toolExists) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [{ type: "text", text: `[PLACEHOLDER] Execution successful for ${toolName}` }],
            isError: false
          }
        }, { headers: CORS_HEADERS });
      }
      
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        error: { code: -32601, message: `Tool not found: ${toolName}` }
      }, { status: 404, headers: CORS_HEADERS });
    }

    if (body.method === 'prompts/list') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { prompts: [] }
      }, { headers: CORS_HEADERS });
    }

    if (body.method === 'resources/list') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { resources: [] }
      }, { headers: CORS_HEADERS });
    }

    // Catch-all for unknown JSON-RPC methods
    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id,
      error: { code: -32601, message: "Method not found" }
    }, { status: 400, headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON-RPC request format" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}