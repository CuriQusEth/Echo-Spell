import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    name: "Echo Spell Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "Echo Spell",
    version: "1.0.0"
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent command received",
      agent: "Echo Spell Orchestrator",
      payload: body
    }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
