# PreshotBadges - Region-Based NFT Deployment Guide

## Overview

The PreshotBadges smart contract is a region-aware, soul-bound ERC-721 NFT system for achievement badges. Users can mint badges specific to their region (Global, Africa, or Asia), with each region having custom metadata and artwork.

## 🎯 Key Features

- **Region-Based Minting**: Supports 3 regions (Global, Africa, Asia) with dynamic metadata
- **Soul-Bound Tokens**: Non-transferable NFTs permanently tied to user wallets
- **Batch Minting**: Efficiently mint multiple badges in a single transaction
- **Dynamic Badge Types**: Admin can add new badge types (up to 10 total)
- **Pausable**: Emergency pause mechanism for security
- **Burn Functionality**: Admin can revoke badges if needed
- **Access Control**: Role-based permissions (Admin & Minter roles)

## 📋 Contract Details

### Badge Types (Initial)
1. **BADGE_ASSESSED** (Type 1): First assessment completed
2. **BADGE_READY** (Type 2): 70+ readiness score achieved
3. **BADGE_CERTIFIED** (Type 3): 3+ courses completed

### Regions
- **REGION_GLOBAL** (0): Default/Global region
- **REGION_AFRICA** (1): Africa region
- **REGION_ASIA** (2): Asia region

### Token URIs
The contract generates dynamic token URIs based on badge type and region:
- Global: `ipfs://<CID>/1.json`
- Africa: `ipfs://<CID>/1-Africa.json`
- Asia: `ipfs://<CID>/1-Asia.json`

---

## 🛠️ Prerequisites

### IPFS Metadata Preparation

Before deployment, prepare your metadata files on IPFS (Pinata recommended):

#### Metadata File Structure
Create JSON files for each badge type and region combination:

**Example: `1.json` (Global - Assessed Badge)**
```json
{
  "name": "Assessed Badge",
  "description": "Completed first Preshot assessment",
  "image": "ipfs://bafybeif.../IpfsAssessed.jpg",
  "attributes": [
    {
      "trait_type": "Badge Type",
      "value": "Assessed"
    },
    {
      "trait_type": "Region",
      "value": "Global"
    }
  ]
}
```

**Example: `1-Africa.json` (Africa - Assessed Badge)**
```json
{
  "name": "Assessed Badge - Africa",
  "description": "Completed first Preshot assessment in Africa",
  "image": "ipfs://bafybeif.../IpfsAfricaAssessed.jpg",
  "attributes": [
    {
      "trait_type": "Badge Type",
      "value": "Assessed"
    },
    {
      "trait_type": "Region",
      "value": "Africa"
    }
  ]
}
```

#### Required Files
Upload these files to Pinata/IPFS:
- `1.json`, `1-Africa.json`, `1-Asia.json` (Assessed)
- `2.json`, `2-Africa.json`, `2-Asia.json` (Ready)
- `3.json`, `3-Africa.json`, `3-Asia.json` (Certified)
- Image files referenced in each JSON

**Note:** Update the `_baseTokenURI` in the constructor if your CID differs from the default.

---

## 🧪 Testing in Remix

### Step 1: Open Remix IDE
Navigate to [remix.ethereum.org](https://remix.ethereum.org)

### Step 2: Create Contract File
1. In the file explorer, create: `contracts/PreshotBadges.sol`
2. Copy the entire contract code from [`src/PreshotBadges.sol`](../src/PreshotBadges.sol)
3. Paste into Remix

### Step 3: Install Dependencies
Remix auto-imports OpenZeppelin contracts. Ensure imports resolve:
```solidity
@openzeppelin/contracts/token/ERC721/ERC721.sol
@openzeppelin/contracts/access/AccessControl.sol
@openzeppelin/contracts/utils/Pausable.sol
@openzeppelin/contracts/utils/Strings.sol
```

### Step 4: Compile
1. Go to **Solidity Compiler** tab (left sidebar)
2. Select compiler version: **0.8.24**
3. Enable optimization: **200 runs** (recommended)
4. Click **Compile PreshotBadges.sol**
5. Verify: No errors (warnings about view functions are safe to ignore)

### Step 5: Deploy to Test Network
1. Go to **Deploy & Run Transactions** tab
2. **Environment**: Select "Injected Provider - MetaMask"
3. **Network**: Switch MetaMask to **Base Sepolia** testnet
   - Network Name: Base Sepolia
   - RPC URL: `https://sepolia.base.org`
   - Chain ID: `84532`
   - Currency Symbol: ETH
   - Block Explorer: `https://sepolia.basescan.org`
4. Ensure you have Base Sepolia ETH ([get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))
5. **Contract**: Select "PreshotBadges"
6. Click **Deploy**
7. Confirm transaction in MetaMask
8. **Copy deployed contract address** from Remix console

### Step 6: Verify Deployment
In Remix, under "Deployed Contracts":
```solidity
// Check default admin role
hasRole(0x00...00, YOUR_ADDRESS) // Should return true

// Check initial token counter
_tokenIdCounter() // Not directly accessible, but first mint will be token ID 1
```

### Step 7: Test Minting
#### Grant Minter Role (if testing from another address)
```solidity
grantMinterRole(MINTER_ADDRESS)
```

#### Mint a Badge
```solidity
// Mint BADGE_ASSESSED for user in Africa (region 1)
mintBadge(USER_ADDRESS, 1, 1)
```

**Parameters:**
- `to`: Recipient wallet address
- `badgeType`: 1 (Assessed), 2 (Ready), or 3 (Certified)
- `region`: 0 (Global), 1 (Africa), or 2 (Asia)

#### Verify Minting
```solidity
// Check ownership
ownerOf(1) // Should return USER_ADDRESS

// Check token URI
tokenURI(1) // Should return: ipfs://<CID>/1-Africa.json

// Check if user has badge
userHasBadge(USER_ADDRESS, 1) // Should return true

// Get all user badges
getUserBadges(USER_ADDRESS) // Should return [1]
```

#### Test Batch Minting
```solidity
// Mint multiple badges at once
batchMintBadges(USER_ADDRESS, [1, 2], 0)
```

#### Test Soul-Bound Property
```solidity
// This should REVERT
transferFrom(USER_ADDRESS, ANOTHER_ADDRESS, 1)
// Error: "Preshot badges are soul-bound and cannot be transferred"
```

#### Test Admin Functions
```solidity
// Update base URI
setBaseURI("ipfs://new-cid/")

// Add new badge type
addBadgeType() // Creates badge type 4

// Pause contract
pause()

// Try minting (should fail while paused)
mintBadge(USER_ADDRESS, 1, 0) // Reverts

// Unpause
unpause()

// Burn a badge (admin only)
burnBadge(1)
```

---

## 🚀 Deploying to Base Testnet (via Foundry)

### Prerequisites
- [Foundry installed](https://book.getfoundry.sh/getting-started/installation)
- Base Sepolia ETH in your wallet
- Basescan API key (for verification)

### Step 1: Set Environment Variables
Create `.env` file in the foundry directory:
```bash
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

**Security:** Never commit `.env` to git! Add to `.gitignore`.

### Step 2: Build Contracts
```bash
cd /home/george/Documents/team/preshot-app/backend/foundry
forge build
```

### Step 3: Deploy to Base Sepolia
```bash
forge create \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $BASESCAN_API_KEY \
  --verify \
  src/PreshotBadges.sol:PreshotBadges
```

**Output will include:**
- Deployer address
- Deployed contract address
- Transaction hash
- Verification status

### Step 4: Verify Contract (if auto-verify fails)
```bash
forge verify-contract \
  --chain-id 84532 \
  --num-of-optimizations 200 \
  --compiler-version 0.8.24 \
  CONTRACT_ADDRESS \
  src/PreshotBadges.sol:PreshotBadges \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Step 5: Interact with Deployed Contract
```bash
# Grant minter role to your MCP agent/backend
cast send CONTRACT_ADDRESS \
  "grantMinterRole(address)" \
  MINTER_ADDRESS \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY

# Mint a badge
cast send CONTRACT_ADDRESS \
  "mintBadge(address,uint256,uint256)" \
  USER_ADDRESS \
  1 \
  1 \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY

# Check token URI
cast call CONTRACT_ADDRESS \
  "tokenURI(uint256)" \
  1 \
  --rpc-url https://sepolia.base.org
```

---

## 🎯 Deploying to Base Mainnet

### Prerequisites
- Sufficient ETH on Base Mainnet for gas
- Verified metadata on IPFS (immutable CID)
- Thoroughly tested on testnet

### Deployment Command
```bash
forge create \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $BASESCAN_API_KEY \
  --verify \
  src/PreshotBadges.sol:PreshotBadges
```

### Post-Deployment Checklist
- [ ] Verify contract on Basescan
- [ ] Test all core functions (mint, tokenURI, etc.)
- [ ] Grant minter role to production backend/MCP server
- [ ] Update frontend with contract address
- [ ] Revoke deployer's minter role (if not needed)
- [ ] Test emergency pause/unpause
- [ ] Document contract address in README

---

## 🔗 Integration with PreshotCredentials

The `PreshotCredentials` contract has been updated to work with region-based minting:

### Interface
```solidity
interface IPreshotBadges {
    function mintBadge(address to, uint256 badgeType, uint256 region) external;
}
```

### Deployment Order
1. Deploy `PreshotBadges` first
2. Deploy `PreshotCredentials` with `PreshotBadges` address as constructor parameter
3. Grant `PreshotCredentials` the MINTER_ROLE on `PreshotBadges`:
   ```solidity
   preshotBadges.grantMinterRole(CREDENTIALS_CONTRACT_ADDRESS)
   ```

### Region Detection in Your Application
The MCP agent/backend should determine user region via:
- IP geolocation
- User profile settings
- Manual selection during onboarding

Then pass the region code (0, 1, or 2) when calling the credentials contract.

---

## 📊 Gas Estimates (Base Sepolia)

| Function | Estimated Gas |
|----------|--------------|
| Deploy Contract | ~2,000,000 |
| Mint Single Badge | ~130,000 |
| Batch Mint (3 badges) | ~340,000 |
| Burn Badge | ~108,000 |
| Grant Role | ~50,000 |
| Set Base URI | ~45,000 |

---

## 🧪 Running Tests

### Run All Tests
```bash
forge test -vv
```

### Run Specific Test
```bash
forge test --match-test testMintBadge -vvvv
```

### Test Coverage
```bash
forge coverage
```

**Current Coverage:** 28/28 tests passing ✅

---

## 🚨 Security Considerations

1. **Admin Key Security**: Store admin private key in secure vault (AWS Secrets Manager, etc.)
2. **Minter Role**: Only grant to trusted contracts/wallets
3. **Pause Mechanism**: Keep admin access to emergency pause
4. **Immutable Metadata**: Use permanent IPFS storage (Pinata, Arweave)
5. **Gas Limits**: Batch minting limited to 5 badges to prevent gas issues
6. **Soul-Bound**: Transfers permanently disabled (except burn)

---

## 📝 Contract Addresses

### Base Sepolia Testnet
- **PreshotBadges**: `TBD` (deploy and update here)
- **PreshotCredentials**: `TBD`

### Base Mainnet
- **PreshotBadges**: `TBD`
- **PreshotCredentials**: `TBD`

---

## 🤝 Support

- **Basescan (Testnet)**: https://sepolia.basescan.org
- **Basescan (Mainnet)**: https://basescan.org
- **Base Docs**: https://docs.base.org
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts

---

## 📜 License

MIT License
