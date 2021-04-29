import { qs } from "../helpers.js";
import View from "./View.js";

class ResultView extends View {
  constructor() {
    super(qs("#result-view"));
    this.template = new Template();
  }

  show(data = []) {
    console.log(data);
    this.element.innerHTML =
      data.length > 0
        ? this.template.getList(data)
        : this.template.getEmptyMessage();
    super.show();
  }
}

class Template {
  getEmptyMessage() {
    return "검색 결과가 없습니다.";
  }
  getList(data = []) {
    return `<ul class="result">${data.map(this._getItem).join("")}</ul>`;
  }
  _getItem({ name, imageUrl }) {
    return `
    <li>
    <img src="${imageUrl}">
    <p>${name}</p>
    </li>
    `;
  }
}

export default ResultView;
