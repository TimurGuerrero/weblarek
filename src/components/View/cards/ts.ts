import { CardBase } from "./CardBase";
import { cloneTemplate } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export interface ICardBasketData extends IProduct {
  index: number;
}

export class CardBasket extends CardBase<ICardBasketData> {
  private deleteButton?: HTMLButtonElement | null = null;
  private handlerBound: () => void;

  constructor(container: HTMLElement, props: ICardBasketData, events: IEvents) {
    super(container, props, events);
    
    // Привязываем контекст один раз
    this.handlerBound = this.handleDelete.bind(this);
  }

  public render(): HTMLElement {
    const card = cloneTemplate<HTMLElement>("#card-basket");

    // Номер по порядку
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
    this.deleteButton = card.querySelector<HTMLButtonElement>(
      ".basket__item-delete"
    );
    
    if (this.deleteButton) {
      // Устанавливаем data-атрибут
      this.deleteButton.dataset.productId = this.data.id;
      
      // Добавляем обработчик только один раз
      this.deleteButton.addEventListener("click", this.handlerBound);
    }

    // Сохраняем данные в dataset
    this.setCardData(card);

    return card;
  }

  // Обработчик удаления
  private handleDelete(): void {
    this.events.emit("card:remove", { productId: this.data.id });
  }

  // Метод для очистки ресурсов
  public destroy(): void {
    if (this.deleteButton) {
      this.deleteButton.removeEventListener("click", this.handlerBound);
    }
  }
}
