import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { default as Example } from "./Network";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Example />
      </header>
    </div>
  );
}

export default App;
