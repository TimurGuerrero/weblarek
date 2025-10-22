import { Component } from "../base/Component";
import { CardGallery } from "./cards/CardGallery";

export class ViewGallery extends Component<{}> {
  constructor(container: HTMLElement) {
    super(container);
  }
  set itemElement(items: CardGallery[]) {
    this.container.replaceChildren(...items.map((item) => item.render()));
  }

  render(): HTMLElement {
    return this.container;
  }
}
