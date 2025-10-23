import { CardBase } from "./CardBase";
import { cloneTemplate } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { categoryMap } from "../../../utils/constants";

// Интерфейс карточки товара
export interface ICardPreviewData extends IProduct {
  inBasket: boolean;
  buttonText: string;
}

export class CardPreview extends CardBase<ICardPreviewData> {
  protected inBasket: boolean;

  constructor(
    container: HTMLElement,
    props: ICardPreviewData,
    events: IEvents
  ) {
    super(container, props, events);
    this.inBasket = props.inBasket || false;
  }

  // Рендер карточки
  public render(): HTMLElement {
    const card = cloneTemplate<HTMLElement>("#card-preview");

    // Заголовок карточки
    const titleElement = card.querySelector(".card__title");
    if (titleElement) titleElement.textContent = this.data.title;

    // Описание карточки товара
    const descriptionEl = card.querySelector(".card__text");
    if (descriptionEl && this.data.description) {
      descriptionEl.textContent = this.data.description;
    }

    // Цена товара
    const priceElement = card.querySelector(".card__price");
    if (priceElement) {
      priceElement.textContent =
        this.data.price != null
          ? this.formatPrice(this.data.price)
          : "Бесценно";
    }

    // Изображение товара
    const imgElement = card.querySelector<HTMLImageElement>(".card__image");
    if (imgElement && this.data.image) {
      const imageUrl = this.data.image;
      const pngUrl = imageUrl.replace(/\.\w+$/, ".png");
      this.setImage(imgElement, pngUrl, this.data.title);
    }

    // Категория и класс товара
    const categoryEl = card.querySelector(".card__category");
    if (categoryEl && this.data.category) {
      categoryEl.textContent = this.data.category;
      const categoryClass =
        categoryMap[this.data.category as keyof typeof categoryMap] ?? "";
      if (categoryClass) categoryEl.classList.add(categoryClass);
    }

    // Кнопка — меняем текст в зависимости от состояния (в корзине/не в корзине)
    const buttonElement =
      card.querySelector<HTMLButtonElement>(".card__button");
    if (buttonElement) {
      buttonElement.textContent = this.inBasket
        ? "Удалить из корзины"
        : this.data.buttonText || "Купить";

      // Кнопка неактивна если цена отсутствует
      if (!this.data.price) {
        buttonElement.disabled = true;
        buttonElement.classList.add("button_disabled");
      }

      // Обработчик кнопки добавления/удаления
      buttonElement.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.inBasket) {
          this.events.emit("card:remove", { productId: this.data.id });
          this.inBasket = false;
        } else {
          this.events.emit("card:add", { productId: this.data.id });
          this.inBasket = true;
        }

        // Меняем текст кнопки если товар уже добавлен в корзину
        buttonElement.textContent = this.inBasket
          ? "Удалить из корзины"
          : "Купить";

        // Обновляем счётчик корзины
        this.events.emit("cart:changed");
      });
    }

    // Сохраняем данные карточки
    this.setCardData(card);

    return card;
  }
}
