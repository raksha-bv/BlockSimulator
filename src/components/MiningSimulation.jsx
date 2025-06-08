import React, { useState } from "react";
import sha256 from "crypto-js/sha256";
import { PlayCircle } from "lucide-react";

// Block class with PoW mining
class Block {
  constructor(data) {
    this.data = data;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(this.data + this.nonce).toString();
  }

  mineBlock(difficulty) {
    const target = "0".repeat(difficulty);
    const start = performance.now();

    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const end = performance.now();
    return {
      hash: this.hash,
      nonce: this.nonce,
      timeTaken: (end - start).toFixed(2), // milliseconds
    };
  }
}

export const MiningSimulation = () => {
  const [difficulty, setDifficulty] = useState(4);
  const [miningResult, setMiningResult] = useState(null);
  const [isMining, setIsMining] = useState(false);

  const handleMine = () => {
    setIsMining(true);
    setTimeout(() => {
      const block = new Block("Hello, Blockchain!");
      const result = block.mineBlock(difficulty);
      setMiningResult(result);
      setIsMining(false);
    }, 50); // allow UI to update
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <PlayCircle className="text-blue-600" />
        Proof-of-Work Mining Simulation
      </h2>

      <div className="mb-4">
        <label className="font-medium mr-2">Difficulty:</label>
        <input
          type="number"
          min={1}
          max={6}
          value={difficulty}
          onChange={(e) => setDifficulty(parseInt(e.target.value))}
          className="w-16 p-1 border rounded text-center"
        />
        <span className="ml-2 text-sm text-gray-600">
          (Leading zeros required in hash)
        </span>
      </div>

      <button
        onClick={handleMine}
        disabled={isMining}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          isMining ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isMining ? "Mining..." : "Start Mining"}
      </button>

      {miningResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded border">
          <div className="mb-2">
            <span className="font-medium">Final Hash:</span>
            <div className="text-xs break-all mt-1 text-green-700 font-mono">
              {miningResult.hash}
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Nonce Attempts:</span>{" "}
            {miningResult.nonce}
          </div>
          <div className="text-sm">
            <span className="font-medium">Time Taken:</span>{" "}
            {miningResult.timeTaken} ms
          </div>
        </div>
      )}
    </div>
  );
};
