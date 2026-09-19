# GamingOS

**AI-powered Operational Intelligence Platform for iGaming Operators**

GamingOS is a pure SaaS platform that helps iGaming operators manage risk, treasury, compliance, support and analytics from a single AI-driven interface.

We **never** custody player funds. The money always stays with the operator.

## Features

- Connect Stellar wallet (Freighter)
- Switch between **Testnet** and **Mainnet**
- Persistent session (localStorage)
- View address on Stellar Expert

## Positioning

> GamingOS is an operational software company for iGaming, powered by AI.  
> Stellar (or any settlement layer) is infrastructure — not the product we sell.

## Core Modules

- AI Operations Center
- AI Support Copilot
- AI Risk Engine
- AI Treasury Engine
- Compliance Center
- Analytics Intelligence + Benchmarks
- Operator Memory
- Reporting Engine
- API Platform
- Stellar Settlement Layer (infrastructure)

## Wallet Connection

Uses **Freighter** (`@stellar/freighter-api`).

1. Install [Freighter](https://www.freighter.app/)
2. Create or import a Stellar account
3. Switch Freighter to Testnet or Mainnet
4. Click **Conectar Wallet** on the site

The selected network is stored and shown in the UI. Make sure Freighter is on the same network.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- `@stellar/freighter-api`
- `@stellar/stellar-sdk`

## Local development

```bash
npm install
npm run dev
```

---

Built for operators who want intelligence, not another payment processor.
