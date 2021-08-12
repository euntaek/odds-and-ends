import React from "react";
import ReactDOM from "react-dom";
import Menu from "./components/Main";
import data from "./data/recipes.json";

ReactDOM.render(<Menu recipes={data} />, document.getElementById("root"));
