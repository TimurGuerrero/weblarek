import { CardBase } from "./CardBase";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { cloneTemplate, formatPrice } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export class CardGallery extends CardBase<IProduct> {
  protected cardElement: HTMLElement;
  protected titleElement: HTMLElement | null;
  protected categoryElement: HTMLElement | null;
  protected imageElement: HTMLImageElement | null;
  protected priceElement: HTMLElement | null;

  constructor(container: HTMLElement, id: string, events: IEvents) {
    super(container, events);

    this.cardElement = cloneTemplate<HTMLElement>("#card-catalog");
    this.titleElement = this.cardElement.querySelector(".card__title");
    this.categoryElement = this.cardElement.querySelector(".card__category");
    this.imageElement =
      this.cardElement.querySelector<HTMLImageElement>(".card__image");
    this.priceElement = this.cardElement.querySelector(".card__price");

    // События при клике
    this.cardElement.addEventListener("click", () => {
      this.events.emit("card:select", { productId: id });
    });
  }

  public render(props: IProduct): HTMLElement {
    // Добавление заголовка
    if (this.titleElement) this.titleElement.textContent = props.title;

    // Добавление категории
    if (this.categoryElement && props.category) {
      this.categoryElement.textContent = props.category;
      const categoryClass =
        categoryMap[props.category as keyof typeof categoryMap] ?? "";
      if (categoryClass) this.categoryElement.classList.add(categoryClass);
    }

    // Добавление изображения
    if (this.imageElement && props.image) {
      const imageUrl = props.image;
      const pngUrl = imageUrl.replace(/\.\w+$/, ".png");
      this.setImage(this.imageElement, pngUrl, props.title);
    }

    // Добавление цены
    if (this.priceElement) {
      this.priceElement.textContent =
        props.price != null ? formatPrice(props.price) : "Бесценно";
    }

    return this.cardElement;
  }
}
