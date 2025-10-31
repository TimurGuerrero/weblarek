import { IProduct } from "../../../types";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { CDN_URL } from "../../../utils/constants";

export abstract class CardBase<T extends IProduct> extends Component<T> {
  public events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
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

  // Метод рендора карточки товара
  public abstract render(props: T): HTMLElement;
}
