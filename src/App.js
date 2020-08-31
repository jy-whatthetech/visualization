import React from "react";
import "./App.css";
import { default as Example } from "./Network";

function App() {
  const [inputValue, setInputValue] = React.useState("placeholder text");
  const [numNodes, setNumNodes] = React.useState(3);

  React.useEffect(() => {
    //TODO:
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      setNumNodes(parsed);
    }

    console.log("input value changed");
  }, [inputValue]);

  return (
    <div className="App">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <form action="/action_page.php">
        <label for="fname">First name:</label>
        <input
          type="text"
          id="fname"
          name="fname"
          value={inputValue}
          onChange={event => {
            setInputValue(event.target.value);
          }}
        />
      </form>
      <Example width={500} height={500} numNodes={numNodes} />
    </div>
  );
}

export default App;
