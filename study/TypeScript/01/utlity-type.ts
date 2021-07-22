interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// Pick
type ShoppingItem = Pick<Product, "id" | "name" | "price">;
function displayProductDetail(shoppingItem: ShoppingItem) {
  return;
}

displayProductDetail({ id: 1, name: "product", price: 1000 });
