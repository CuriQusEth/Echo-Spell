# Echo Spells

**Echo Spells** is a rhythmic, atmospheric spell-casting platform integrated with ERC-8004 and smart AI Agents. Built natively for Base Mainnet.

## 🌟 Project Overview
Our platform acts as a high-performance orchestration environment, letting players cast complex arcane patterns while the **Echo Spell Orchestrator** intelligent agent helps manage spell combos, automate smart contracts, and record performance on-chain.

## 🤖 Echo Spell Orchestrator (AI Agent)
This platform includes comprehensive support for an ERC-8004 AI Agent via the **Model Context Protocol (MCP)**.

### MCP Connection Guide
Connecting external clients (e.g. Claude Desktop, Web3 Agent Interfaces) to the Echo Spell Orchestrator is simple.

The backend exposes rigorous JSON-RPC 2.0 endpoints compliant with the latest Next.js 14 App Router standards.

- **Agent Card (Discovery)**: `/.well-known/agent-card.json`
  Defines all endpoints, identities, and skills required for external indexers to find the Orchestrator.
- **MCP Endpoint**: `/api/mcp`
  Direct JSON-RPC 2.0 connection. Use `POST` to execute `initialize`, `tools/list`, and `tools/call` procedures.
- **Agent Info API**: `/api/agent`
  Lightweight REST endpoint exposing standard availability and metadata.

### Orchestrator Skills
The agent comes fully prepared with the following skills mapped into the system:
- **Echo Magic**
- **Spell Casting**
- **Arcane Automation**
- **Multi-Spell Orchestration**
- **Magic System Management**
- **Ritual Automation**
- **MCP Command Execution**

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router configured for API endpoints) / React
- **Smart Contract Connectors:** Wagmi, Viem (Base Mainnet)
- **Styling:** Tailwind CSS, Framer Motion
- **Protocols:** ERC-8004 (Trustless Agents), ERC-8021, MCP

## 🚀 Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the local development server:**
   ```bash
   npm run dev
   ```

3. **Test the MCP Endpoint Local Connectivity:**
   ```bash
   curl -X POST http://localhost:3000/api/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```