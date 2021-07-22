import { emit, on } from "../helpers.js";

const tag = "[View]";

class View {
  constructor(element) {
    console.log(tag, "constructor");
    if (!element) throw "no element";
    this.element = element;
    this.originalDisplay = this.element.style.display;
  }
  hide() {
    this.element.style.display = "none";
    return this;
  }
  show() {
    this.element.style.display = "block";
    return this;
  }
  on(eventName, handler) {
    on(this.element, eventName, handler);
    return this;
  }
  emit(eventName, data) {
    emit(this.element, eventName, data);
    return this;
  }
}

export default View;
