import React, { useState, useEffect } from "react";
import sha256 from "crypto-js/sha256";
import {
  Hash,
  Pickaxe,
  RotateCcw,
  Clock,
  Database,
  Link,
  Zap,
} from "lucide-react";

// Block class
class Block {
  constructor(index, timestamp, data, previousHash = "", difficulty = 2) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.difficulty = difficulty;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock() {
    const prefix = "0".repeat(this.difficulty);
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

export const BlockSimulation = () => {
  const [blocks, setBlocks] = useState([]);
  const [difficulty, setDifficulty] = useState(3);
  const [miningInProgress, setMiningInProgress] = useState({});

  useEffect(() => {
    resetChain();
  }, []);

  const resetChain = () => {
    const block1 = new Block(
      0,
      new Date().toLocaleString(),
      { amount: 10 },
      "0",
      difficulty
    );
    block1.mineBlock();

    const block2 = new Block(
      1,
      new Date().toLocaleString(),
      { amount: 20 },
      block1.hash,
      difficulty
    );
    block2.mineBlock();

    const block3 = new Block(
      2,
      new Date().toLocaleString(),
      { amount: 30 },
      block2.hash,
      difficulty
    );
    block3.mineBlock();

    setBlocks([block1, block2, block3]);
    setMiningInProgress({});
  };

  const handleDataChange = (index, newAmount) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].data.amount = parseInt(newAmount);
    updatedBlocks[index].hash = updatedBlocks[index].calculateHash();
    updatedBlocks[index].nonce = 0;
    updateHashesFrom(index, updatedBlocks);
  };

  const updateHashesFrom = (startIndex, updatedBlocks) => {
    for (let i = startIndex + 1; i < updatedBlocks.length; i++) {
      updatedBlocks[i].previousHash = updatedBlocks[i - 1].hash;
      updatedBlocks[i].hash = updatedBlocks[i].calculateHash();
      updatedBlocks[i].nonce = 0;
    }
    setBlocks([...updatedBlocks]);
  };

  const mineBlock = async (index) => {
    setMiningInProgress((prev) => ({ ...prev, [index]: true }));

    // Add a small delay to show mining in progress
    setTimeout(() => {
      const updatedBlocks = [...blocks];
      updatedBlocks[index].difficulty = difficulty;
      updatedBlocks[index].mineBlock();
      updateHashesFrom(index, updatedBlocks);
      setMiningInProgress((prev) => ({ ...prev, [index]: false }));
    }, 100);
  };

  const isBlockValid = (index) => {
    const current = blocks[index];
    const calculatedHash = sha256(
      current.index +
        current.timestamp +
        JSON.stringify(current.data) +
        current.previousHash +
        current.nonce
    ).toString();
    const validPrefix = "0".repeat(current.difficulty);

    if (
      current.hash !== calculatedHash ||
      !current.hash.startsWith(validPrefix)
    ) {
      return false;
    }
    if (index > 0 && current.previousHash !== blocks[index - 1].hash) {
      return false;
    }
    return true;
  };

  const BlockHeader = ({ block, isValid }) => (
    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Database
          className={`w-5 h-5 ${isValid ? "text-green-600" : "text-red-600"}`}
        />
        <h3 className="font-bold text-lg">Block #{block.index}</h3>
      </div>
      <div
        className={`px-2 py-1 rounded text-xs font-medium ${
          isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isValid ? "VALID" : "INVALID"}
      </div>
    </div>
  );

  const BlockField = ({ icon: Icon, label, value, className = "" }) => (
    <div className="flex items-start gap-2 p-2 border-b border-gray-100 last:border-b-0">
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-gray-600 block">
          {label}:
        </span>
        <div className={`text-sm ${className}`}>{value}</div>
      </div>
    </div>
  );

  const MineButton = ({ index, isValid, isMining }) => (
    <button
      onClick={() => mineBlock(index)}
      disabled={isMining}
      className={`w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
        isMining
          ? "bg-gray-400 cursor-not-allowed"
          : isValid
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : "bg-green-500 hover:bg-green-600 text-white"
      }`}
    >
      {isMining ? (
        <>
          <Zap className="w-4 h-4 animate-pulse" />
          Mining...
        </>
      ) : (
        <>
          <Pickaxe className="w-4 h-4" />
          {isValid ? "Re-Mine Block" : "Mine Block"}
        </>
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Hash className="text-blue-600" />
          Block Chain Simulation
        </h2>
        <p className="text-gray-600">
          Interactive demonstration of blockchain structure and mining
        </p>
      </div>

      {/* Controls Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Difficulty:
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="p-2 border rounded w-20 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500">
              (Higher = more zeros required in hash)
            </span>
          </div>
          <button
            onClick={resetChain}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RotateCcw size={18} />
            Reset Chain
          </button>
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
        {blocks.map((block, i) => {
          const isValid = isBlockValid(i);
          const isMining = miningInProgress[i];

          return (
            <div
              key={i}
              className={`border-2 rounded-lg transition-all ${
                isValid
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              } ${isMining ? "animate-pulse" : ""}`}
            >
              <div className="p-4">
                <BlockHeader block={block} isValid={isValid} />

                <div className="bg-white rounded-lg border divide-y">
                  <BlockField
                    icon={Clock}
                    label="Timestamp"
                    value={block.timestamp}
                  />

                  <div className="flex items-start gap-2 p-2">
                    <Database className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-gray-600 block">
                        Amount:
                      </span>
                      <input
                        type="number"
                        value={block.data.amount}
                        onChange={(e) => handleDataChange(i, e.target.value)}
                        className="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <BlockField
                    icon={Link}
                    label="Previous Hash"
                    value={block.previousHash}
                    className="break-all font-mono text-xs"
                  />

                  <BlockField
                    icon={Hash}
                    label="Hash"
                    value={block.hash}
                    className="break-all font-mono text-xs"
                  />

                  <BlockField
                    icon={Zap}
                    label="Nonce"
                    value={block.nonce.toLocaleString()}
                    className="font-mono"
                  />
                </div>

                <MineButton index={i} isValid={isValid} isMining={isMining} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chain Status */}
      {blocks.some((_, i) => !isBlockValid(i)) && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">Chain Invalid</h3>
          </div>
          <p className="text-sm text-red-700">
            One or more blocks are invalid. Mine affected blocks in sequence to
            restore validity.
          </p>
        </div>
      )}
    </div>
  );
};
