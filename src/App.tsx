import React from "react";
import "./App.css";
import Graph from "./graph/Graph";
import * as ParseUtils from "./parser/parseUtils";
import * as Utils from "./utils/utils";

function App() {
  const [inputValue, setInputValue] = React.useState("");
  // graph payload (with minimalist structure)
  const [data, setData] = React.useState({
    nodes: [
      { id: "Harry", x: 50, y: 50 },
      { id: "Sally", x: 100, y: 200 },
      { id: "Alice", x: 200, y: 200 }
    ],
    links: [
      { source: "Harry", target: "Sally" },
      { source: "Harry", target: "Alice" }
    ]
  });

  React.useEffect(() => {
    if (!inputValue) return;

    let parsedValue: any;
    try {
      parsedValue = ParseUtils.parsePairs(inputValue);
    } catch (ex) {
      console.error(ex);
      return;
    }

    const tempNodes: Array<any> = [];

    for (let nodeId of Array.from(parsedValue.nodeSet)) {
      let x = Utils.randomInRange(10, 400);
      let y = Utils.randomInRange(10, 300);
      tempNodes.push({ id: nodeId, x: x, y: y });
    }

    console.log(parsedValue);
    parsedValue.nodes = tempNodes;
    setData(parsedValue);
  }, [inputValue]);

  return (
    <>
      [[2,1],[3,1],[1,4]]
      <form>
        <label>
          Graph Input:
          <textarea
            id="graph-input"
            name="graph-input"
            value={inputValue}
            onChange={event => {
              setInputValue(event.target.value);
            }}
          />
        </label>
      </form>
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={data}
      />
    </>
  );
}

export default App;
