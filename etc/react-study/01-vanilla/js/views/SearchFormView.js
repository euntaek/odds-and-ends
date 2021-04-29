import { on, qs } from "../helpers.js";
import View from "./View.js";

class FormView extends View {
  constructor() {
    super(qs("#form-view"));
    this.inputElement = qs("[type=text]", this.element);
    this.resetElement = qs("[type=reset]", this.element);
    this.showResetButton(false);
    this.bindEvents();
  }

  showResetButton(visible = true) {
    this.resetElement.style.display = visible ? "block" : "none";
  }

  bindEvents() {
    on(this.inputElement, "keyup", (e) => this.handleKeyup(e));
    on(this.resetElement, "click", () => this.handleClickReset());
    this.on("submit", (e) => e.preventDefault());
  }
  handleKeyup(e) {
    const ENTER = "Enter";
    const { value } = this.inputElement;
    this.showResetButton(value.length > 0);
    if (value.length === 0) this.emit("@reset");
    if (e.key === ENTER) this.emit("@submit", { value });
  }
  handleClickReset() {
    console.log("reset");
    this.emit("@reset");
  }
}

export default FormView;
