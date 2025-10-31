import { CardBase } from "./CardBase";
import { cloneTemplate, formatPrice } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { categoryMap } from "../../../utils/constants";

// Интерфейс карточки товара
export interface ICardPreviewData extends IProduct {
  inBasket: boolean;
  buttonText: string;
}

export class CardPreview extends CardBase<ICardPreviewData> {
  protected cardElement: HTMLElement;
  protected titleElement: HTMLElement | null;
  protected descriptionElement: HTMLElement | null;
  protected priceElement: HTMLElement | null;
  protected imageElement: HTMLImageElement | null;
  protected categoryElement: HTMLElement | null;
  protected buttonElement: HTMLButtonElement | null;

  constructor(
    container: HTMLElement,
    id: string,
    inBasket: boolean = false,
    events: IEvents
  ) {
    super(container, events);

    this.cardElement = cloneTemplate<HTMLElement>("#card-preview");
    this.titleElement = this.cardElement.querySelector(".card__title");
    this.descriptionElement = this.cardElement.querySelector(".card__text");
    this.priceElement = this.cardElement.querySelector(".card__price");
    this.imageElement =
      this.cardElement.querySelector<HTMLImageElement>(".card__image");
    this.categoryElement = this.cardElement.querySelector(".card__category");
    this.buttonElement =
      this.cardElement.querySelector<HTMLButtonElement>(".card__button");

    // Обработчик кнопки добавления/удаления
    if (this.buttonElement) {
      this.buttonElement.addEventListener("click", (e) => {
        e.stopPropagation();
        if (inBasket) {
          this.events.emit("card:remove", { productId: id });
          inBasket = false;
        } else {
          this.events.emit("card:add", { productId: id });
          inBasket = true;
        }

        if (this.buttonElement) {
          // Меняем текст кнопки если товар уже добавлен в корзину
          this.buttonElement.textContent = inBasket
            ? "Удалить из корзины"
            : "Купить";
        }
      });
    }
  }

  // Рендер карточки
  public render(props: ICardPreviewData): HTMLElement {
    // Заголовок карточки
    if (this.titleElement) this.titleElement.textContent = props.title;

    // Описание карточки товара
    if (this.descriptionElement && props.description) {
      this.descriptionElement.textContent = props.description;
    }

    // Цена товара
    if (this.priceElement) {
      this.priceElement.textContent =
        props.price != null ? formatPrice(props.price) : "Бесценно";
    }

    // Изображение товара
    if (this.imageElement && props.image) {
      const imageUrl = props.image;
      const pngUrl = imageUrl.replace(/\.\w+$/, ".png");
      this.setImage(this.imageElement, pngUrl, props.title);
    }

    // Категория и класс товара
    if (this.categoryElement && props.category) {
      this.categoryElement.textContent = props.category;
      const categoryClass =
        categoryMap[props.category as keyof typeof categoryMap] ?? "";
      if (categoryClass) this.categoryElement.classList.add(categoryClass);
    }

    // Кнопка — меняем текст в зависимости от состояния (в корзине/не в корзине)
    if (this.buttonElement) {
      this.buttonElement.textContent = props.inBasket
        ? "Удалить из корзины"
        : props.buttonText || "Купить";

      // Кнопка неактивна если цена отсутствует
      if (!props.price) {
        this.buttonElement.disabled = true;
        this.buttonElement.classList.add("button_disabled");
      }
    }

    return this.cardElement;
  }
}
