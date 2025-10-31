import { Component } from "../base/Component.ts";
import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";
import {CardGallery} from "./cards/CardGallery.ts";

type Props = {
  items: IProduct[]
  events: IEvents
}

export class ViewGallery extends Component<{}> {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.container = container;
  }

  render({items, events}: Props): HTMLElement {
    const itemsElements: HTMLElement[] = items.map(item => {
      return new CardGallery(document.createElement("div"), item.id, events).render(item)
    });

    this.container.replaceChildren(...itemsElements);

    return this.container;
  }
}
