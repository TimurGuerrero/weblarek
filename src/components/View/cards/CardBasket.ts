import { CardBase } from "./CardBase";
import { cloneTemplate, formatPrice } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

// Интерфейс для данных корзины
export interface ICardBasketItemData extends IProduct {
  index: number;
}

// Класс карточки товара в корзине
export class CardBasket extends CardBase<ICardBasketItemData> {
  protected cardElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement | null;
  protected counterElement: HTMLElement | null;
  protected titleElement: HTMLElement | null;
  protected priceElement: HTMLElement | null;
  protected id: string;

  constructor(container: HTMLElement, id: string, events: IEvents) {
    super(container, events);

    this.cardElement = cloneTemplate<HTMLElement>("#card-basket");
    this.deleteButtonElement =
      this.cardElement.querySelector<HTMLButtonElement>(".basket__item-delete");
    this.counterElement = this.cardElement.querySelector<HTMLElement>(
      ".basket__item-index"
    );
    this.titleElement =
      this.cardElement.querySelector<HTMLElement>(".card__title");
    this.priceElement =
      this.cardElement.querySelector<HTMLElement>(".card__price");
    this.id = id;

    // Обработчик клика по кнопке удаления товара из корзины
    if (this.deleteButtonElement) {
      this.deleteButtonElement.addEventListener("click", (e: Event) => {
        e.stopPropagation();
        this.events.emit("card:remove", { productId: id });
      });
    }
  }

  // Рендер карточки корзины
  public render(props: ICardBasketItemData): HTMLElement {
    // Номер по порядку в списке покупок в корзине
    if (this.counterElement)
      this.counterElement.textContent = String(props.index);

    // Название товара
    if (this.titleElement) this.titleElement.textContent = props.title;

    // Цена товара
    if (this.priceElement) {
      this.priceElement.textContent =
        props.price != null ? formatPrice(props.price) : "";
    }

    return this.cardElement;
  }

  public destroy(): void {
    if (this.deleteButtonElement) {
      this.deleteButtonElement.removeEventListener("click", (e: Event) => {
        e.stopPropagation();
        this.events.emit("card:remove", { productId: this.id });
      });
    }
  }
}
