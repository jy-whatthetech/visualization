import React from "react";
import "./App.css";
import Graph from "./graph/Graph";
import * as ParseUtils from "./parser/parseUtils";

function App() {
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    //TODO:
    console.log("input value changed");
    console.log(inputValue);

    const parsedValue = ParseUtils.parsePairs(inputValue);

    console.log("parsed value");
    console.log(parsedValue);
  }, [inputValue]);

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
    <>
      <form>
        <label>Graph Input:</label>
        <textarea
          id="graph-input"
          name="graph-input"
          value={inputValue}
          onChange={event => {
            setInputValue(event.target.value);
          }}
        />
      </form>
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={data}
      />
    </>
  );
}

export default App;
