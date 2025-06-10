# 🔗 Blockchain Simulator

An interactive React-based blockchain simulator to understand how core blockchain concepts work—block linking, tampering, mining (Proof-of-Work), and consensus mechanisms like PoW, PoS, and DPoS.

---

## 🚀 Features

### 🧱 Block Simulation
- Create and visualize a basic blockchain with 3 linked blocks
- Each block contains `index`, `data`, `previousHash`, `nonce`, and `hash`
- Edit the `amount` field of any block — all subsequent blocks become invalid (red)
- Click **"Mine Block"** to recalculate a valid hash
- Highlights how one block’s change can affect the entire chain

### ⚒️ Mining Simulation
- Simulates **Proof-of-Work (PoW)** using SHA-256
- Adjustable difficulty: number of leading `0`s in the hash (1 to 6)
- Displays:
  - ✅ Valid hash
  - 🔁 Nonce attempts
  - ⏱ Time taken to mine the block

### 🧠 Consensus Simulation
- Choose between:
  - **PoW (Proof of Work)** — based on computational power
  - **PoS (Proof of Stake)** — based on token stake
  - **DPoS (Delegated Proof of Stake)** — based on votes
- Simulates how a validator/miner is selected for each mechanism

---

## Tasks

- 📘 [Task 1](./Task1.pdf)
- 📘 [Task 2](./Task2.pdf)


---

## 🛠️ Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/blockchain-simulator.git
cd blockchain-simulator

# Install dependencies
npm install

# Run the development server
npm run dev
