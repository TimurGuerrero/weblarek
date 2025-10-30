import { CardBase } from "./CardBase";
import { cloneTemplate } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

// Интерфейс для данных корзины
export interface ICardBasketData extends IProduct {
  index: number;
}

// Класс карточки товара в корзине
export class CardBasket extends CardBase<ICardBasketData> {
  constructor(container: HTMLElement, props: ICardBasketData, events: IEvents) {
    super(container, props, events);
  }

  // Рендер карточки корзины
  public render(): HTMLElement {
    const card = cloneTemplate<HTMLElement>("#card-basket");

    // Номер по порядку в списке покупок в корзине
    const indexElement = card.querySelector(".basket__item-index");
    if (indexElement) indexElement.textContent = String(this.data.index);

    // Название товара
    const titleElement = card.querySelector(".card__title");
    if (titleElement) titleElement.textContent = this.data.title;

    // Цена товара
    const priceElement = card.querySelector(".card__price");
    if (priceElement) {
      priceElement.textContent =
        this.data.price != null ? this.formatPrice(this.data.price) : "";
    }

    // Кнопка удаления
    const deleteButton = card.querySelector<HTMLButtonElement>(".basket__item-delete");
    if (deleteButton) {
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.events.emit("card:remove", { productId: this.data.id });
      });
    }
    
    // Сохраняем данные в dataset
    this.setCardData(card);

    return card;
  }

}