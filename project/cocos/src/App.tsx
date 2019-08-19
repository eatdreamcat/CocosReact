import React, { Component } from "react";
import UploadButton from "./components/UploadButton";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Monster Ball</h1>
        <UploadButton project="MonsterBall" />
        <h1>Punch moon</h1>
        <UploadButton project="Punchmoon" />
      </div>
    );
  }
}

export default App;
