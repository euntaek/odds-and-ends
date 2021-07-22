class TabView extends View {
  constructor() {
    super(qs("#tab-view"));

    this.template = new Template();
  }

  show() {
    this.element.innerHTML = this.template.getTabList();

    super.show();
  }
}
