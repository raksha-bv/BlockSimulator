import React, { useState, useEffect } from "react";
import { Play, Hash, Users, Zap, Clock, Target } from "lucide-react";

// Utility function to create SHA-256 hash
const createHash = (data) => {
  // Simple hash function for demonstration (not actual SHA-256)
  let hash = 0;
  const str = JSON.stringify(data);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
};

// Block class
class Block {
  constructor(index, data, previousHash = "") {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return createHash({
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previousHash: this.previousHash,
      nonce: this.nonce,
    });
  }

  mineBlock(difficulty) {
    const target = "0".repeat(difficulty);
    let attempts = 0;
    const startTime = Date.now();

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
      attempts++;

      // Prevent infinite loop in demo
      if (attempts > 100000) break;
    }

    const endTime = Date.now();
    return {
      attempts,
      time: endTime - startTime,
      hash: this.hash,
    };
  }
}

// Blockchain class
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Consensus mechanisms
const simulatePoW = () => {
  const miners = [
    { id: "Miner A", power: Math.floor(Math.random() * 1000) + 100 },
    { id: "Miner B", power: Math.floor(Math.random() * 1000) + 100 },
    { id: "Miner C", power: Math.floor(Math.random() * 1000) + 100 },
  ];

  const winner = miners.reduce((prev, current) =>
    prev.power > current.power ? prev : current
  );

  return { miners, winner, method: "Proof of Work" };
};

const simulatePoS = () => {
  const stakers = [
    { id: "Staker X", stake: Math.floor(Math.random() * 5000) + 1000 },
    { id: "Staker Y", stake: Math.floor(Math.random() * 5000) + 1000 },
    { id: "Staker Z", stake: Math.floor(Math.random() * 5000) + 1000 },
  ];

  const winner = stakers.reduce((prev, current) =>
    prev.stake > current.stake ? prev : current
  );

  return { stakers, winner, method: "Proof of Stake" };
};

const simulateDPoS = () => {
  const delegates = [
    { id: "Delegate 1", votes: Math.floor(Math.random() * 10000) + 2000 },
    { id: "Delegate 2", votes: Math.floor(Math.random() * 10000) + 2000 },
    { id: "Delegate 3", votes: Math.floor(Math.random() * 10000) + 2000 },
  ];

  const winner = delegates.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return { delegates, winner, method: "Delegated Proof of Stake" };
};

export default function BlockchainSimulation() {
  const [blockchain, setBlockchain] = useState(new Blockchain());
  const [activeTab, setActiveTab] = useState("blocks");
  const [miningResult, setMiningResult] = useState(null);
  const [difficulty, setDifficulty] = useState(2);
  const [consensusResult, setConsensusResult] = useState(null);
  const [isValid, setIsValid] = useState(true);

  // Initialize blockchain with 3 blocks
  useEffect(() => {
    const bc = new Blockchain();
    bc.addBlock(new Block(1, "First Block - Transaction Data"));
    bc.addBlock(new Block(2, "Second Block - More Transactions"));
    setBlockchain(bc);
    setIsValid(bc.isChainValid());
  }, []);

  const handleTamperBlock = (blockIndex) => {
    const newBlockchain = new Blockchain();
    newBlockchain.chain = [...blockchain.chain];

    // Tamper with the block data
    newBlockchain.chain[blockIndex].data =
      "TAMPERED DATA - This block has been modified!";
    // Don't recalculate hash to show tampering

    setBlockchain(newBlockchain);
    setIsValid(newBlockchain.isChainValid());
  };

  const handleMineBlock = async () => {
    const newBlock = new Block(
      blockchain.chain.length,
      `Block ${blockchain.chain.length} - New Transaction Data`
    );
    newBlock.previousHash = blockchain.getLatestBlock().hash;

    const result = newBlock.mineBlock(difficulty);
    setMiningResult(result);

    const newBlockchain = new Blockchain();
    newBlockchain.chain = [...blockchain.chain, newBlock];
    setBlockchain(newBlockchain);
    setIsValid(newBlockchain.isChainValid());
  };

  const runConsensusSimulation = (type) => {
    let result;
    switch (type) {
      case "pow":
        result = simulatePoW();
        break;
      case "pos":
        result = simulatePoS();
        break;
      case "dpos":
        result = simulateDPoS();
        break;
      default:
        return;
    }
    setConsensusResult(result);
  };

  const resetBlockchain = () => {
    const bc = new Blockchain();
    bc.addBlock(new Block(1, "First Block - Transaction Data"));
    bc.addBlock(new Block(2, "Second Block - More Transactions"));
    setBlockchain(bc);
    setIsValid(bc.isChainValid());
    setMiningResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Blockchain Simulation Suite
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of blockchain concepts
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab("blocks")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "blocks"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Hash className="inline w-4 h-4 mr-2" />
              Block Chain
            </button>
            <button
              onClick={() => setActiveTab("mining")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "mining"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Zap className="inline w-4 h-4 mr-2" />
              Mining
            </button>
            <button
              onClick={() => setActiveTab("consensus")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "consensus"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="inline w-4 h-4 mr-2" />
              Consensus
            </button>
          </div>
        </div>

        {/* Block Chain Tab */}
        {activeTab === "blocks" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-semibold">Blockchain Status</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isValid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isValid ? "✓ Valid Chain" : "✗ Invalid Chain"}
                  </span>
                  <button
                    onClick={resetBlockchain}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Reset Chain
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {blockchain.chain.map((block, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Block #{block.index}
                        </h3>
                        <p className="mb-1">
                          <strong>Data:</strong> {block.data}
                        </p>
                        <p className="mb-1">
                          <strong>Timestamp:</strong>{" "}
                          {new Date(block.timestamp).toLocaleString()}
                        </p>
                        <p>
                          <strong>Nonce:</strong> {block.nonce}
                        </p>
                      </div>
                      <div>
                        <p className="mb-2">
                          <strong>Hash:</strong>{" "}
                          <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded break-all">
                            {block.hash}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong>Previous Hash:</strong>{" "}
                          <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded break-all">
                            {block.previousHash}
                          </span>
                        </p>
                        {index > 0 && (
                          <button
                            onClick={() => handleTamperBlock(index)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Tamper with Block
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Try This:</h3>
              <p className="text-blue-700">
                Click "Tamper with Block" on any block to modify its data.
                Notice how the chain becomes invalid because the hash no longer
                matches the block content, breaking the chain integrity.
              </p>
            </div>
          </div>
        )}

        {/* Mining Tab */}
        {activeTab === "mining" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Proof of Work Mining
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Difficulty Level (number of leading zeros required)
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value={1}>1 (Easy)</option>
                  <option value={2}>2 (Medium)</option>
                  <option value={3}>3 (Hard)</option>
                  <option value={4}>4 (Very Hard)</option>
                </select>
              </div>

              <button
                onClick={handleMineBlock}
                className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4 transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Mine New Block
              </button>

              {miningResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Mining Results:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-700">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>
                        Attempts: {miningResult.attempts.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Time: {miningResult.time}ms</span>
                    </div>
                    <div className="flex items-center">
                      <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        Hash: {miningResult.hash.substring(0, 12)}...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                🎯 Understanding Mining:
              </h3>
              <p className="text-yellow-700">
                Mining involves finding a nonce value that makes the block hash
                start with a certain number of zeros. Higher difficulty means
                more zeros required, which exponentially increases the
                computational work needed.
              </p>
            </div>
          </div>
        )}

        {/* Consensus Tab */}
        {activeTab === "consensus" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Consensus Mechanisms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => runConsensusSimulation("pow")}
                  className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-left transition-colors"
                >
                  <h3 className="font-semibold text-blue-700">Proof of Work</h3>
                  <p className="text-sm text-gray-600">
                    Highest computational power wins
                  </p>
                </button>

                <button
                  onClick={() => runConsensusSimulation("pos")}
                  className="p-4 border border-green-300 rounded-lg hover:bg-green-50 text-left transition-colors"
                >
                  <h3 className="font-semibold text-green-700">
                    Proof of Stake
                  </h3>
                  <p className="text-sm text-gray-600">
                    Highest stake amount wins
                  </p>
                </button>

                <button
                  onClick={() => runConsensusSimulation("dpos")}
                  className="p-4 border border-purple-300 rounded-lg hover:bg-purple-50 text-left transition-colors"
                >
                  <h3 className="font-semibold text-purple-700">
                    Delegated PoS
                  </h3>
                  <p className="text-sm text-gray-600">
                    Most voted delegate wins
                  </p>
                </button>
              </div>

              {consensusResult && (
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">
                    {consensusResult.method} Results:
                  </h3>

                  <div className="grid gap-2 mb-4">
                    {(
                      consensusResult.miners ||
                      consensusResult.stakers ||
                      consensusResult.delegates
                    ).map((participant, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${
                          participant.id === consensusResult.winner.id
                            ? "bg-green-100 border-2 border-green-300"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="font-medium">{participant.id}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">
                              {participant.power &&
                                `Power: ${participant.power}`}
                              {participant.stake &&
                                `Stake: ${participant.stake.toLocaleString()}`}
                              {participant.votes &&
                                `Votes: ${participant.votes.toLocaleString()}`}
                            </span>
                            {participant.id === consensusResult.winner.id && (
                              <span className="text-green-600 font-semibold">
                                👑 Winner
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                    <strong>Selection Logic:</strong> In{" "}
                    {consensusResult.method}, the validator with the highest{" "}
                    {consensusResult.method === "Proof of Work"
                      ? "computational power"
                      : consensusResult.method === "Proof of Stake"
                      ? "stake amount"
                      : "number of votes"}{" "}
                    is selected to validate the next block.
                  </div>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-800 mb-2">
                🔍 Consensus Comparison:
              </h3>
              <ul className="text-indigo-700 space-y-1 text-sm">
                <li>
                  <strong>PoW:</strong> Energy-intensive but highly secure
                  (Bitcoin)
                </li>
                <li>
                  <strong>PoS:</strong> Energy-efficient, validators chosen by
                  stake (Ethereum 2.0)
                </li>
                <li>
                  <strong>DPoS:</strong> Fast and scalable, uses elected
                  delegates (EOS)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
