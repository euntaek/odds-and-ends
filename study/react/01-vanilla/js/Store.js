class Store {
  constructor(storage) {
    this.storage = storage;
    this.searchKeyword = "";
    this.searchResult = [];
  }
  search(keyword) {
    this.searchKeyword = keyword;
    this.searchResult = this.storage.productData.filter((p) =>
      p.name.includes(keyword)
    );
  }
}

export default Store;
