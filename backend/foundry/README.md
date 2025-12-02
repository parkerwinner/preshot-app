# Preshot Foundry Contracts

## Overview

Solidity smart contracts for the Preshot talent readiness platform on Base Sepolia.

### Contracts

- **PreshotCredentials.sol**: Stores IPFS URLs for user assessment data with signature verification
- **PreshotBadges.sol**: Soul-bound ERC-721 NFTs for achievement badges

### Setup

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install dependencies:
```bash
forge install
```

3. Build contracts:
```bash
forge build
```

4. Run tests:
```bash
forge test
```

### Deployment

1. Set environment variables:
```bash
export PRIVATE_KEY="your_private_key_here"
export BASESCAN_API_KEY="your_basescan_api_key"
```

2. Deploy to Base Sepolia:
```bash
forge script script/Deploy.s.sol:DeployPreshot --rpc-url base_sepolia --broadcast --verify
```

### Contract Addresses (Base Sepolia)

- **PreshotBadges**: TBD after deployment
- **PreshotCredentials**: TBD after deployment

### Badge Types

1. **ASSESSED** (Type 1): First assessment completed
2. **READY** (Type 2): Achieved 70+ readiness score  
3. **CERTIFIED** (Type 3): Completed 3+ mindset courses

### Key Features

- IPFS URL storage for decentralized assessment data
- Signature verification for AI-assisted submissions
- Automatic badge minting on achievements
- Soul-bound NFTs (non-transferable)
- Access control for minting permissions
