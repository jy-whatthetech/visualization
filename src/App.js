import React from "react";
import "./App.css";
import Graph from "./graph/Graph";

function App() {
  // graph payload (with minimalist structure)
  const data = {
    nodes: [
      { id: "Harry", x: 50, y: 50 },
      { id: "Sally", x: 100, y: 200 },
      { id: "Alice", x: 200, y: 200 }
    ],
    links: [
      { source: "Harry", target: "Sally" },
      { source: "Harry", target: "Alice" }
    ]
  };

  return (
    <Graph
      id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
      data={data}
    />
  );
}

export default App;
