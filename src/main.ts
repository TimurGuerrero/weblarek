import "./scss/styles.scss";

import { ProductCatalogModel } from "./components/models/ProductCatalogModel";
import { ShoppingCartModel } from "./components/models/ShoppingCartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { ShopApi } from "./components/Api/ShopApi";

import { IOrder, TPayment } from "./types/index";

import { Api } from "./components/base/Api";
import { StallAPI } from "./components/base/StallAPI";
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";

import { ViewHeader } from "./components/View/ViewHeader";
import { ViewGallery } from "./components/View/ViewGallery";
import { ViewModal } from "./components/View/ViewModal";
import { ViewBasket } from "./components/View/ViewBasket";
import { FormOrder } from "./components/View/forms/FormOrder";
import { FormContact } from "./components/View/forms/FormContact";
import { ViewSuccess } from "./components/View/ViewSuccess";
import { ensureElement } from "./utils/utils";

// const catalog = new ProductCatalogModel();
// const cart = new ShoppingCartModel();
// const buyer = new BuyerModel();

// catalog.setItems(apiProducts.items);

document.addEventListener("DOMContentLoaded", async () => {
  const productCatalog = new ProductCatalogModel(); // модель каталога
  const shoppingCart = new ShoppingCartModel(); // модель корзины
  const buyer = new BuyerModel(); // модель покупателя

  const events = new EventEmitter(); // централизованный эмиттер событий
  const api = new Api(API_URL); // API слой
  const stallApi = new StallAPI(api); // API модели
});

// Представление
  const header = new ViewHeader(events, ensureElement<HTMLElement>(".header"));
  const catalog = new ViewGallery(ensureElement<HTMLElement>(".gallery"));
  const modal = new ViewModal(
    ensureElement<HTMLElement>("#modal-container"),
    events
  );
  const basketView = new ViewBasket(events);

  const order = new FormOrder(document.createElement("div"), events);
  const contacts = new FormContact(document.createElement("div"), events);
  const success = new ViewSuccess(document.createElement("div"), events);









// console.log("Массив товаров из каталога: ", catalog.getItems());
// console.log(
//   `Товар с id "c101ab44-ed99-4a54-990d-47aa2bb4e7d9": `,
//   catalog.getItemById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
// );

// cart.addItem(apiProducts.items[0]);
// cart.addItem(apiProducts.items[1]);
// console.log("Товары в корзине: ", cart.getItems());
// console.log("Общая стоимость: ", cart.getTotal());
// console.log("Количество товаров: ", cart.getCount());
// console.log(
//   `Проверка наличия товара с id "c101ab44-ed99-4a54-990d-47aa2bb4e7d9": `,
//   cart.isInCart("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
// );

// buyer.setData({ email: "test@test.com", payment: "card" });
// console.log("Данные покупателя: ", buyer.getData());
// console.log("Результат валидации: ", buyer.validate());
// buyer.clear();
// console.log("Данные покупателя после очистки: ", buyer.getData());

// const api = new ShopApi("https://example.com/api");

// api.getProducts().then((products) => {
//   console.log("Товары с сервера:", products);
// });

// const testOrder: IOrder = {
//   items: ["854cef69-976d-4c2a-a18c-2aa45046c390"],
//   total: 750,
//   buyer: {
//     payment: "card" as TPayment,
//     email: "test@test.com",
//     phone: "1234567890",
//     address: "Москва, Арбат, 1",
//   },
// };

// api.orderProducts(testOrder).then((order) => {
//   console.log("Заказ успешно создан:", order);
// });
