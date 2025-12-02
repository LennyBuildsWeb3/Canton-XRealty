# Canton XRealty

**WebXR Mixed Reality Real Estate Marketplace**
*Tokenized Real World Assets on Canton Network*

## Live Demo

**Live Application**: [canton-xrealty.vercel.app](https://canton-xrealty.vercel.app)

**Demo Video**: *(Coming Soon - Quest 3 Mixed Reality Walkthrough)*

[![Canton Network](https://img.shields.io/badge/Canton-Network-00d4aa)](https://www.canton.network/)
[![WebXR](https://img.shields.io/badge/WebXR-Quest%203-blue)](https://immersive-web.github.io/webxr/)
[![DAML](https://img.shields.io/badge/DAML-Smart%20Contracts-purple)](https://daml.com/)

---

## Overview

Canton XRealty is a Mixed Reality marketplace for tokenized real estate assets. Using Meta Quest 3's passthrough technology, investors can visualize tokenized properties in their physical environment and execute compliant investments on the Canton Network.

### Why Canton Network?

| Feature | Benefit for RWA |
|---------|-----------------|
| **Privacy** | Confidential transactions - only authorized parties see sensitive data |
| **Interoperability** | Connect multiple financial institutions seamlessly |
| **Regulatory Compliance** | Built-in support for KYC/AML and accredited investor verification |
| **Atomic Transactions** | Guaranteed settlement without counterparty risk |

---

## Features

### Mixed Reality Experience
- **Spatial Visualization**: Place tokenized properties on your desk in real-world scale
- **Hand Tracking**: Natural interaction using Quest 3's hand tracking
- **Data Overlays**: Real-time token metrics floating beside 3D models
- **Virtual Tours**: Step inside properties in VR mode

### Canton Network Integration
- **DAML Smart Contracts**: Type-safe, auditable tokenization logic
- **Privacy-Preserving**: Only authorized investors see transaction details
- **Compliance-First**: Built-in KYC/AML verification workflow
- **Dividend Distribution**: Automated yield payments to token holders

### Investment Dashboard
- Live token prices and availability
- Historical yield performance
- Compliance status indicators
- One-click investment execution

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CANTON XREALTY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Quest 3    │     │   WebXR     │     │   Canton    │       │
│  │  Headset    │────▶│   Client    │────▶│   Network   │       │
│  │  (MR/VR)    │     │  (A-Frame)  │     │   (DAML)    │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │    Hand     │     │   3D Asset  │     │   Smart     │       │
│  │  Tracking   │     │   Renderer  │     │  Contracts  │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
canton-realty-xr/
├── index.html                 # Main WebXR application
├── src/
│   ├── app.js                 # Application logic & interactions
│   └── data/
│       └── mock-canton-data.js # Simulated Canton API responses
├── daml/                      # Canton Network smart contracts
│   ├── daml.yaml              # DAML project configuration
│   └── src/
│       ├── RealEstateToken.daml      # Core tokenization contracts
│       └── RealEstateTokenTest.daml  # Contract test scenarios
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Meta Quest 3 (for MR experience)
- Modern browser with WebXR support

### Local Development

```bash
# Clone and enter directory
cd canton-realty-xr

# Start local server
npx serve .

# Open in browser
open http://localhost:3000
```

### Quest 3 Testing

Quest 3 requires HTTPS for WebXR. Use ngrok for development:

```bash
# Terminal 1: Start server
npx serve . -p 8080

# Terminal 2: Create HTTPS tunnel
ngrok http 8080

# Use the HTTPS URL in Quest 3 browser
# Example: https://abc123.ngrok.io
```

---

## Smart Contracts (DAML)

### Core Templates

#### RealEstateProperty
Main template representing a tokenized property:

```daml
template RealEstateProperty
  with
    issuer : Party
    regulator : Party
    propertyId : Text
    name : Text
    valuation : Valuation
    totalTokens : Int
    availableTokens : Int
    tokenSymbol : Text
  where
    signatory issuer
    observer regulator
    
    choice IssueTokens : ContractId RealEstateTokenHolding
      with investor : Party, tokenAmount : Int
      controller issuer
```

#### RealEstateTokenHolding
Investor's token ownership:

```daml
template RealEstateTokenHolding
  with
    holder : Party
    tokens : Int
    yieldEntitlement : Decimal
  where
    signatory issuer, holder
    
    choice Transfer : ContractId RealEstateTokenHolding
      with newHolder : Party, transferTokens : Int
      controller holder
```

#### InvestorRegistry
KYC/AML compliant investor verification:

```daml
template InvestorRegistry
  with
    registrar : Party
    investor : Party
    status : InvestorStatus  -- Pending | Verified | Accredited
    jurisdiction : Text
  where
    signatory registrar
    
    choice CheckEligibility : Bool
      with propertyCompliance : ComplianceStatus
      controller registrar
```

### Building Contracts

```bash
cd daml

# Install DAML SDK (if not installed)
curl -sSL https://get.daml.com/ | sh

# Build contracts
daml build

# Run tests
daml test

# Start local Canton sandbox
daml start
```

---

## Controls

### Desktop
| Action | Control |
|--------|---------|
| Select property | Click |
| Rotate view | Drag |
| Zoom | Scroll |

### Quest 3 (Mixed Reality)
| Action | Control |
|--------|---------|
| Highlight property | Point with hand |
| Select property | Pinch gesture |
| Confirm investment | Tap button |

---

## Security & Compliance

### Canton Network Privacy Architecture

Canton Network provides enterprise-grade privacy for real estate tokenization through several key mechanisms:

#### Sub-Transaction Privacy
Unlike public blockchains where all transaction details are visible to everyone, Canton ensures that only authorized parties can see sensitive financial information. For real estate investments, this means:
- **Investor Privacy**: Other investors cannot see your purchase amounts or holdings
- **Price Confidentiality**: Transaction prices remain private between buyer and seller
- **Competitive Advantage**: Asset managers can execute strategies without revealing positions

#### Selective Disclosure
Each party in a Canton transaction only receives the data they need to know:
- **Investors** see their own holdings and entitled yields
- **Property Issuers** see aggregate token sales without individual investor details
- **Regulators** have read access to verify compliance without blocking transactions
- **Auditors** can verify specific transactions when authorized

#### Data Minimization
Canton follows the principle of least privilege:
```
Traditional Blockchain:     Canton Network:
┌─────────────────┐        ┌─────────────────┐
│   All parties   │        │ Investor sees:  │
│   see complete  │        │ - Own holdings  │
│   transaction   │        │ - Property data │
│   history of    │        │                 │
│   everyone      │        │ (NOT others'    │
└─────────────────┘        │  positions)     │
                           └─────────────────┘
```

#### Regulatory Compliance
Canton's privacy model is designed for regulated markets:
- **KYC/AML Integration**: Investor verification before token issuance
- **Accredited Investor Verification**: Smart contract enforced eligibility
- **Jurisdiction Controls**: Property access restricted by legal requirements
- **Audit Trail**: Regulators maintain visibility without transaction participation

### Compliance Workflow

```
Investor Registration → KYC Verification → Accreditation Check
         ↓                    ↓                    ↓
    InvestorRegistry    UpdateStatus         CheckEligibility
         ↓                    ↓                    ↓
                    TokenPurchaseOrder
                           ↓
                    ApproveOrder → ExecuteOrder
                           ↓
                  RealEstateTokenHolding
```

---

## Demo Properties

| Property | Type | Location | Value | Yield | Tokens |
|----------|------|----------|-------|-------|--------|
| Central Park Penthouse | Residential Luxury | Upper West Side, NYC | $3.2M | 8.5% | 3,200 CPPH |
| Hudson Yards Tower | Residential Apartment | Hudson Yards, NYC | $1.2M | 6.8% | 2,400 HYRD |
| Wall Street Plaza | Commercial Office | Financial District, NYC | $6.5M | 9.3% | 3,250 WSPL |

---

## Market Opportunity

### Real Estate Tokenization Market

The global real estate market represents one of the largest asset classes, with significant potential for blockchain-based tokenization:

**Market Size**:
- Global real estate value: $326.5 trillion (2024)
- Tokenized RWA market projection: $16 trillion by 2030
- Current tokenized real estate: $2.8 billion (0.02% penetration)

**Key Drivers**:
1. **Fractional Ownership**: Lower barriers to entry for retail investors
2. **Liquidity**: 24/7 trading vs. traditional months-long property sales
3. **Global Access**: Cross-border investment without complex legal structures
4. **Transparency**: Blockchain-based ownership records and yield distribution
5. **Efficiency**: Reduced intermediaries and transaction costs

**Target Segments**:
- **Accredited Investors**: Diversification into institutional-grade properties
- **Real Estate Funds**: Tokenized REIT structures with daily liquidity
- **Family Offices**: Private real estate exposure with fractional positions
- **Retail Investors**: Access to commercial properties previously unavailable

**Why Canton Network**:
Traditional blockchain solutions face regulatory challenges for RWA tokenization:
- Public blockchains expose sensitive investor data
- Smart contracts cannot enforce jurisdiction restrictions
- No built-in compliance for accredited investor requirements

Canton's privacy-preserving architecture solves these challenges, enabling compliant tokenization at scale.

---

## Roadmap

### Phase 1: MVP (Current)
- [x] WebXR visualization
- [x] Mock Canton integration
- [x] DAML smart contracts
- [x] Basic investment flow

### Phase 2: Canton Integration
- [ ] Connect to Canton testnet
- [ ] Real DAML contract deployment
- [ ] Wallet integration

### Phase 3: Production
- [ ] Mainnet deployment
- [ ] KYC provider integration
- [ ] Multi-property portfolio view
- [ ] Secondary market trading

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

## Acknowledgments

- [Canton Network](https://www.canton.network/) - Privacy-enabled blockchain infrastructure
- [Digital Asset](https://www.digitalasset.com/) - DAML smart contract language
- [A-Frame](https://aframe.io/) - WebXR framework
- [Meta Quest](https://www.meta.com/quest/) - Mixed Reality hardware

---

<div align="center">

**Canton XRealty** - *The Future of Real Estate Investment*

[Live Demo](https://canton-xrealty.vercel.app) · [Canton Network](https://canton.network) · [DAML Docs](https://docs.daml.com)

</div>