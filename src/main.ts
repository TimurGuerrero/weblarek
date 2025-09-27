import "./scss/styles.scss";

import { apiProducts } from "./utils/data";
import { ProductCatalogModel } from "./components/models/ProductCatalogModel";
import { ShoppingCartModel } from "./components/models/ShoppingCartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { ShopApi } from "./components/Api/ShopApi";
import { IOrder, TPayment } from "./types/index";

const catalog = new ProductCatalogModel();
const cart = new ShoppingCartModel();
const buyer = new BuyerModel();

catalog.setItems(apiProducts.items);

console.log("Массив товаров из каталога: ", catalog.getItems());
console.log(
  `Товар с id "c101ab44-ed99-4a54-990d-47aa2bb4e7d9": `,
  catalog.getItemById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
);

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
console.log("Товары в корзине: ", cart.getItems());
console.log("Общая стоимость: ", cart.getTotal());
console.log("Количество товаров: ", cart.getCount());
console.log(
  `Проверка наличия товара с id "c101ab44-ed99-4a54-990d-47aa2bb4e7d9": `,
  cart.isInCart("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
);

buyer.setData({ email: "test@test.com", payment: "card" });
console.log("Данные покупателя: ", buyer.getData());
console.log("Результат валидации: ", buyer.validate());
buyer.clear();
console.log("Данные покупателя после очистки: ", buyer.getData());

const api = new ShopApi("https://example.com/api");

api.getProducts().then((products) => {
  console.log("Товары с сервера:", products);
});

const testOrder: IOrder = {
  items: ["854cef69-976d-4c2a-a18c-2aa45046c390"],
  total: 750,
  buyer: {
    payment: "card" as TPayment,
    email: "test@test.com",
    phone: "1234567890",
    address: "Москва, Арбат, 1",
  },
};

api.orderProducts(testOrder).then((order) => {
  console.log("Заказ успешно создан:", order);
});
