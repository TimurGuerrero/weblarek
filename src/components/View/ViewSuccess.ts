import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { cloneTemplate, ensureElement } from "../../utils/utils";

// Класс отображения успешного оформления заказа
export class ViewSuccess extends Component<{}> {
  protected events: IEvents;
  private successTemplate!: HTMLElement;
  private descriptionElement!: HTMLElement;
  private closeButton!: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.createTemplate();
  }

  // Создаёт шаблон успеха
  private createTemplate(): void {
    this.successTemplate = cloneTemplate<HTMLElement>("#success");

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.successTemplate
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.successTemplate
    );

    // Обработчик закрытия
    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
      this.events.emit("catalog:open");
    });
  }

  // Ренд формы успеха, с подставлением суммы заказа
  public render(total?: number): HTMLElement {
    if (total !== undefined) {
      this.descriptionElement.textContent = `Списано ${total} синапсов`;
    }
    return this.successTemplate;
  }
}