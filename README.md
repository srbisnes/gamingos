# GamingOS

**AI-powered Operational Intelligence Platform for iGaming Operators**

## Stellar Wallet (Testnet auto-register)

Al pulsar **Conectar Stellar**:

1. Se genera un Keypair Stellar Testnet (si no existe sesión)
2. Se encripta el Secret Key (AES-256-GCM)
3. Se fondea automáticamente con Friendbot
4. Se conecta a Horizon Testnet
5. El usuario ve:

```
✅ Wallet Stellar creada
✅ Cuenta fondeada en Testnet
✅ Lista para operar
```

También soporta **Freighter** como wallet externa.

### API

| Method | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/wallet/create` | Crea + fondea wallet Testnet |
| `GET`  | `/api/wallet/balance?publicKey=G...&network=testnet` | Balance XLM |
| `POST` | `/api/wallet/airdrop` | Re-fondea vía Friendbot |

### Seguridad

- Secrets encriptados con `WALLET_ENCRYPTION_KEY` (env)
- El secret solo se devuelve **una vez** al crear
- Store actual: in-memory (demo). Producción → Postgres:

```sql
CREATE TABLE wallets (
  id TEXT PRIMARY KEY,
  public_key TEXT UNIQUE NOT NULL,
  encrypted_secret TEXT NOT NULL,
  network TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Variables de entorno

```env
WALLET_ENCRYPTION_KEY=tu-clave-larga-y-secreta
```

### Local

```bash
npm install
npm run dev
```

Live: https://gamingos-1quf.vercel.app
