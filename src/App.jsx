import { useState } from "react";

import "./index.css";
import BlockchainSimulation from "./components/BlockchainSimulation";

function App() {
  const [count, setCount] = useState(0);

  return <BlockchainSimulation />;
}

export default App;
