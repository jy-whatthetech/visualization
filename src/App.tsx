import React from "react";
import "./App.css";
import Graph from "./graph/Graph";
import * as ParseUtils from "./parser/parseUtils";
import * as Utils from "./utils/utils";
import { InputType, getLabel } from "./parser/inputTypes";

// TODO: Add ability to specify own nodes

function App() {
  const [inputValue, setInputValue] = React.useState("");
  const [comboValue, setComboValue] = React.useState(0);
  const [directed, setDirected] = React.useState(true);
  const [customNodes, setCustomNodes] = React.useState("");

  // graph payload (with minimalist structure)
  const [data, setData] = React.useState({
    nodes: [
      { id: "Harry", x: 50, y: 50 },
      { id: "Sally", x: 100, y: 200 },
      { id: "Alice", x: 200, y: 200 }
    ],
    links: [
      { source: "Harry", target: "Sally", label: "test123" },
      { source: "Harry", target: "Alice", label: "test456" }
    ]
  });

  React.useEffect(() => {
    if (!inputValue) return;

    let parsedValue: any;
    try {
      parsedValue = ParseUtils.processInput(inputValue, comboValue);
    } catch (ex) {
      console.error(ex);
      return;
    }

    const tempNodes: Array<any> = [];

    for (let nodeId of Array.from(parsedValue.nodeSet)) {
      let x = Utils.randomInRange(10, 800);
      let y = Utils.randomInRange(10, 500);
      tempNodes.push({ id: nodeId, x: x, y: y });
    }

    console.log(parsedValue);
    parsedValue.nodes = tempNodes;
    setData(parsedValue);
  }, [inputValue]);

  return (
    <>
      [[2,1],[3,1],[1,4]]
      <br />
      [[1],[],[0,5],[],[1,3,0],[0]]
      <br />
      <form>
        <label>Choose an input type:</label>
        <select
          onChange={e => {
            setComboValue(parseInt(e.target.value));
          }}
        >
          {Object.keys(InputType)
            .filter(k => typeof InputType[k as any] !== "number")
            .map(key => (
              <option key={key} value={key}>
                {getLabel(parseInt(key))}
              </option>
            ))}
        </select>
        <br />
        <label>
          Directed:{" "}
          <input
            type="checkbox"
            value={"directedValue"}
            checked={directed}
            onChange={e => setDirected(!directed)}
          />
        </label>
        <br />
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
        <label>
          Custom Nodes:
          <textarea
            id="custom-nodes"
            name="custom-nodes"
            value={customNodes}
            onChange={event => {
              setCustomNodes(event.target.value);
            }}
          />
        </label>
      </form>
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        inputType={comboValue}
        directed={directed}
        customNodes={customNodes}
        data={data}
      />
    </>
  );
}

export default App;
