import React, { Component } from "react";
import Cytoscape from "./components/Cytoscape";
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";
import cytoscapeStore from "./util/CytoscapeStore";
import StylePage from "./components/StylePage";

class App extends Component {
  constructor() {
    super();
    StylePage.parseStyles();
  }
  render() {
    return (
      <div className="App">
        <TopBar />
        <Cytoscape cytoscapeStore={cytoscapeStore} />
        <BottomBar />
      </div>
    );
  }
}

export default App;
