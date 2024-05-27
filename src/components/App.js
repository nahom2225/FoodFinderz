import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
//By centering the entire homepage, every component will be centered

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <HomePage/>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);