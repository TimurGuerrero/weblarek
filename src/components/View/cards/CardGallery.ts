import { CardBase } from "./CardBase";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { cloneTemplate } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export class CardGallery extends CardBase<IProduct> {
  constructor(container: HTMLElement, property: IProduct, events: IEvents) {
    super(container, property, events);
  }

  public render(): HTMLElement {
    const card = cloneTemplate<HTMLElement>("#card-catalog");

    // Добавление заголовка
    const titleElement = card.querySelector(".card__title");
    if (titleElement) titleElement.textContent = this.data.title;

    // Добавление категории
    const categoryElement = card.querySelector(".card__category");
    if (categoryElement && this.data.category) {
      categoryElement.textContent = this.data.category;
      const categoryClass =
        categoryMap[this.data.category as keyof typeof categoryMap] ?? "";
      if (categoryClass) categoryElement.classList.add(categoryClass);
    }

    // Добавление изображения
    const imgElement = card.querySelector<HTMLImageElement>(".card__image");
    if (imgElement && this.data.image) {
      const imageUrl = this.data.image;
      const pngUrl = imageUrl.replace(/\.\w+$/, ".png");
      this.setImage(imgElement, pngUrl, this.data.title);
    }

    // Добавление цены
    const priceElement = card.querySelector(".card__price");
    if (priceElement) {
      priceElement.textContent =
        this.data.price != null
          ? this.formatPrice(this.data.price)
          : "Бесценно";
    }

    // Сохранить данные
    this.setCardData(card);

    // События при клике
    card.addEventListener("click", () => {
      this.events.emit("card:select", { productId: this.data.id });
    });

    return card;
  }
}
