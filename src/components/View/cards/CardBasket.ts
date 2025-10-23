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
  protected index: number;

  constructor(container: HTMLElement, props: ICardBasketData, events: IEvents) {
    super(container, props, events);
    this.index = props.index;
  }

  // Рендер карточки корзины
  public render(): HTMLElement {
    const card = cloneTemplate<HTMLElement>("#card-basket");

    // Номер по порядку в списке покупок в корзине
    const indexElement = card.querySelector(".basket__item-index");
    if (indexElement) indexElement.textContent = String(this.index);

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
    const buttonElement = card.querySelector<HTMLButtonElement>(
      ".basket__item-delete"
    );
    if (buttonElement) {
      buttonElement.addEventListener("click", () => {
        this.events.emit("card:remove", { productId: this.data.id });
      });
    }

    // Сохраняем данные в dataset
    this.setCardData(card);

    return card;
  }

  // Устанавливаем индекс товара
  public setIndex(index: number) {
    this.index = index;
  }

  // Получаем индекс товара
  public getIndex(): number {
    return this.index;
  }

  // Получаем цену товара
  public getPrice(): number {
    return Number(this.data.price) || 0;
  }
}