import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

// Класс универсального модального окна
export class ViewModal extends Component<{}> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.contentContainer = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    // Закрытие модального окна по кнопке
    this.closeButton.addEventListener("click", () => this.close());

    // Закрытие модального окна при клике вне окна
    container.addEventListener("click", (event) => {
      if (event.target === container) this.close();
    });
  }

  // Открытие модальнго окна с контентом
  public open(content: HTMLElement) {
    this.contentContainer.replaceChildren();
    this.contentContainer.appendChild(content);
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  // Закрытие модальнго окна
  public close() {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }

  // Получить текущий контент модального окна
  public get content() {
    return this.contentContainer;
  }
}