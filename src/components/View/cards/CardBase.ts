import { IProduct } from "../../../types";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { CDN_URL } from "../../../utils/constants";
import { setElementData } from "../../../utils/utils";

export abstract class CardBase<T extends IProduct> extends Component<T> {
  public data: T;
  public events: IEvents;

  constructor(container: HTMLElement, data: T, events: IEvents) {
    super(container);
    this.data = data;
    this.events = events;
  }
  // IMG карточки товара
  protected setImage(
    image: HTMLImageElement,
    src: string,
    alt?: string | undefined
  ) {
    if (image) {
      image.src = `${CDN_URL}/${src}`;
      if (alt) {
        image.alt = alt;
      }
    }
  }

  // Цена товара
  protected setPrice(price: HTMLSpanElement, value: number) {
    if (price) {
      price.textContent = value.toLocaleString();
    }
  }
  protected setTitle(title: HTMLHeadingElement, value: string) {
    if (title) {
      title.textContent = value;
    }
  }

  // Запись данных карточки товара
  protected setCardData(element: HTMLElement) {
    setElementData(element, {
      id: this.data.id ?? "",
      title: this.data.title,
      description: this.data.description ?? "",
      category: this.data.category ?? "",
      price: this.data.price ?? "",
      imageUrl: this.data.image ?? "",
    });
  }

    protected formatPrice(price?: string | number): string {
  return price != null ? `${new Intl.NumberFormat("ru-RU").format(+price)} синапсов` : "";
}

  // Метод рендора карточки товара
  public abstract render(): HTMLElement;
}
