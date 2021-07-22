const tag = "[Controller]";

class Controller {
  constructor(store, { searchFormView, resultView }) {
    console.log(tag, "constructor");
    this.store = store;
    this.searchFormView = searchFormView;
    this.resultView = resultView;
    this.subscribeEvent();
  }
  subscribeEvent() {
    this.searchFormView
      .on("@submit", (e) => this.search(e.detail.value))
      .on("@reset", () => this.reset());
  }
  search(keyword) {
    console.log(keyword);
    this.store.search(keyword);
    this.render();
  }
  reset() {
    console.log("reset");
    this.store.searchResult = [];
    this.store.searchKeyword = "";
    this.render();
  }
  render() {
    if (this.store.searchKeyword.length > 0) {
      return this.resultView.show(this.store.searchResult);
    }
    this.resultView.hide();
  }
}

export default Controller;
