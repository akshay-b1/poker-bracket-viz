import React from "react";
import Bracket from "./components/Bracket";
import bracketData from "./data/bracketData.json";

function App() {
  return (
    <div className="App">
      <Bracket data={bracketData} />
    </div>
    
  );
}

export default App;
