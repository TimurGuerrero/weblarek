import "./scss/styles.scss";

import { ProductCatalogModel } from "./components/models/ProductCatalogModel";
import { ShoppingCartModel } from "./components/models/ShoppingCartModel";
import { Buyer } from "./components/models/BuyerModel";

import { IOrderRequest, TPayment } from "./types/index";

import { Api } from "./components/base/Api";
import { StallAPI } from "./components/base/StallAPI";
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";

import { ViewBasket } from "./components/View/ViewBasket";
import { ViewGallery } from "./components/View/ViewGallery";
import { ViewHeader } from "./components/View/ViewHeader";
import { ViewModal } from "./components/View/ViewModal";
import { ViewSuccess } from "./components/View/ViewSuccess";

import { FormContact } from "./components/View/forms/FormContact";
import { FormOrder } from "./components/View/forms/FormOrder";

import { CardGallery } from "./components/View/cards/CardGallery";
import { CardPreview } from "./components/View/cards/CardPreview";
import { CardBasket } from "./components/View/cards/CardBasket";

import { ensureElement } from "./utils/utils";

document.addEventListener("DOMContentLoaded", async () => {
  const events = new EventEmitter(); // централизованный эмиттер событий
  const api = new Api(API_URL); // API слой
  const stallApi = new StallAPI(api); // API модели

  const productCatalog = new ProductCatalogModel(); // модель каталога
  const shoppingCart = new ShoppingCartModel(); // модель корзины
  const buyer = new Buyer(events); // модель покупателя

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

  // Загрузка каталога товаров
  try {
    const items = await stallApi.fetchProducts();
    productCatalog.setItems(items);

    catalog.itemElement = items.map(
      (item) =>
        new CardGallery(document.createElement("div"), { ...item }, events)
    );
  } catch (err) {
    console.error("Ошибка загрузки товаров:", err);
  }

  // Просмотр товара
  events.on<{ productId: string }>("card:select", ({ productId }) => {
    const product = productCatalog.getItemById(productId);
    if (!product) return;

    productCatalog.setSelectedItem(product);

    const inBasket = shoppingCart.isInCart(product.id);
    const preview = new CardPreview(
      document.createElement("div"),
      {
        ...product,
        inBasket,
        buttonText: inBasket ? "Удалить из корзины" : "Купить",
      },
      events
    );

    modal.open(preview.render());
  });

  // Формирование данных заказа
  const getOrderData = (): IOrderRequest => {
    const data = buyer.getData();
    const missing: string[] = [];
    if (!data.payment) missing.push("payment");
    if (!data.email) missing.push("email");
    if (!data.phone) missing.push("phone");
    if (!data.address) missing.push("address");

    if (missing.length > 0) {
      throw new Error(`Данные покупателя неполные: ${missing.join(", ")}`);
    }

    return {
      payment: data.payment as TPayment,
      email: data.email as string,
      phone: data.phone as string,
      address: data.address as string,
      total: shoppingCart.getTotal(),
      items: shoppingCart.getItems().map((i) => i.id),
    };
  };

  // Обновление корзины: пересоздаёт список карточек и обновляет цену
  const updateBasket = () => {
    const items = shoppingCart.getItems().map((product, index) => {
      const card = new CardBasket(
        document.createElement("div"),
        { ...product, index: index + 1 },
        events
      );
      return card.render();
    });
    basketView.setItems(items);
    basketView.setTotalPrice(shoppingCart.getTotal());
    header.counter = shoppingCart.getCount();
  };

  // Слушатели событий
  events.on("cart:changed", updateBasket);

  events.on<{ productId: string }>("card:add", ({ productId }) => {
    const product = productCatalog.getItemById(productId);
    if (product && !shoppingCart.isInCart(product.id))
      shoppingCart.addItem(product);
  });

  events.on<{ productId: string }>("card:remove", ({ productId }) => {
    const item = shoppingCart.getItems().find((i) => i.id === productId);
    if (item) shoppingCart.removeItem(item);
  });

  events.on("basket:open", () => modal.open(basketView.render()));

  events.on("basket:order", () => {
    if (shoppingCart.getCount() === 0) return;
    const buyerData = buyer.getData();
    modal.open(
      order.render({
        payment: (buyerData.payment ?? "") as TPayment,
        address: buyerData.address ?? "",
      })
    );
  });

  events.on("order:submitted", () => {
    const buyerData = buyer.getData();
    modal.open(
      contacts.render({
        email: buyerData.email ?? "",
        phone: buyerData.phone ?? "",
      })
    );
  });

  // Обработка изменений поля формы оплаты
  events.on<{ payment: TPayment }>("order:paymentChange", ({ payment }) => {
    console.log(
      "<<< event order:paymentChange",
      payment,
      "before:",
      buyer.getData()
    );
    buyer.setPayment(payment);
    console.log(">>> buyer after setPayment:", buyer.getData());
  });

  // Обработка изменений поля формы адреса
  events.on<{ address: string }>("order:addressChange", ({ address }) => {
    console.log(
      "<<< event order:addressChange",
      address,
      "before:",
      buyer.getData()
    );
    buyer.setAddress(address);
    console.log(">>> buyer after setAddress:", buyer.getData());
  });

  // Обработка запроса валидации заказа
  events.on("order:requestValidation", () => {
    console.log("<<< event order:requestValidation");
    buyer.requestOrderValidation();
  });

  // Обработка отправки формы заказа
  events.on("order:submit", () => {
    const validation = buyer.validate();

    // Сопоставляем только поля формы заказа
    const orderErrors: Partial<
      Record<keyof import("./components/View/forms/FormOrder").IOrderFormData, string>
    > = {
      payment: (validation as any).payment,
      address: (validation as any).address,
    };

    // Показываем ошибки на форме заказа
    order.validate(orderErrors);

    // Если именно поля заказа валидны — переходим к вводу контактов
    if (!orderErrors.payment && !orderErrors.address) {
      events.emit("order:submitted");
    }
  });

  // Обработка изменений полей формы контактов
  events.on(
    "contacts:fieldChange",
    (data: { field: "email" | "phone"; value: string }) => {
      if (data.field === "email") {
        buyer.setEmail(data.value);
      } else if (data.field === "phone") {
        buyer.setPhone(data.value);
      }

      // Запускаем валидацию после изменения
      const validation = buyer.validate();
      events.emit("contacts:validate", validation);
    }
  );

  // Валидация формы заказа
  events.on("order:validate", (errors) => {
    console.log("<<< event order:validate (raw from buyer.validate):", errors);
    // Сопоставляем ошибки модели buyer с полями формы заказа
    const orderErrors: Partial<
      Record<
        keyof import("./components/View/forms/FormOrder").IOrderFormData,
        string
      >
    > = {
      payment: (errors as any).payment,
      address: (errors as any).address,
    };
    console.log(">>> dispatching to order.validate:", orderErrors);
    order.validate(orderErrors);
  });

  // Валидация формы контактов
  events.on("contacts:validate", (errors) => {
    contacts.validate(errors);
  });

  // Обработка запроса валидации
  events.on("contacts:requestValidation", () => {
    const validation = buyer.validate();
    events.emit("contacts:validate", validation);
  });

  // Обработчик "contacts:submit" — проверяем только поля контактов и запускаем "contacts:submitted"
  events.on("contacts:submit", () => {
    console.log("event contacts:submit");
    const validation = buyer.validate();
    const contactErrors: Partial<
      Record<keyof import("./components/View/forms/FormContact").IContactsFormData, string>
    > = {
      email: (validation as any).email,
      phone: (validation as any).phone,
    };

    // Показать ошибки на форме контактов
    contacts.validate(contactErrors);

    // Если ошибок нет — переходим к отправке заказа
    if (!contactErrors.email && !contactErrors.phone) {
      events.emit("contacts:submitted");
    } else {
      console.log("contacts invalid:", contactErrors);
    }
  });



  // Обработчик успешного оформления заказа:
  events.on("contacts:submitted", async () => {
    const orderData = getOrderData();
    try {
      const response = await stallApi.sendOrder(orderData);
      shoppingCart.clear();
      buyer.clear();
      modal.open(success.render(response.total));
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
    }
  });

  // Возврат к каталогу
  events.on("catalog:open", () => {
    modal.close();
  });
});

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
