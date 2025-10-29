import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

// Интерфейс данных шапки сайта
interface IHeader {
  counter: number;
}

export class ViewHeader extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    // Поиск элемента счётчика корзины
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    // Поиск кнопки корзины
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );

    // Обработчик клика на корзину
    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  // Количество товаров в корзине
  setCounter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
