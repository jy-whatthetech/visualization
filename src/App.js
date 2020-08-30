import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { default as Example } from "./Network";

function parseInputValue(text) {
  //Do something to update node state
}

function App() {
  const [inputValue, setInputValue] = React.useState("placeholder text");

  React.useEffect(() => {
    //TODO:
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
      <Example width={500} height={500} />
    </div>
  );
}

export default App;
