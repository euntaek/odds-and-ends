import Controller from "./Controller.js";
import Store from "./Store.js";
import storage from "./storage.js";
import SearchFormView from "./views/SearchFormView.js";
import ResultView from "./views/ResultView.js";

function main() {
  console.log("main");
  const store = new Store(storage);
  const view = {
    searchFormView: new SearchFormView(),
    resultView: new ResultView(),
  };
  console.log(view);
  new Controller(store, view);
}

document.addEventListener("DOMContentLoaded", main);
