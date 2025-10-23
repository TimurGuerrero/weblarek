import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class ViewBasket extends Component<{}> {
  protected events: IEvents;
  private containerBasket: HTMLElement;
  private listContainer: HTMLElement;
  private totalPriceElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(events: IEvents) {
    super(document.createElement("div"));
    this.events = events;

    const basketTemplate = cloneTemplate<HTMLElement>("#basket");
    this.containerBasket = basketTemplate;

    this.listContainer = ensureElement<HTMLElement>(
      ".basket__list",
      basketTemplate
    );
    this.totalPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      basketTemplate
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      basketTemplate
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  // Устанавливает список товаров в корзине
  public setItems(items: HTMLElement[]): void {
    if (!items.length) {
      this.listContainer.innerHTML = "<div>Корзина пуста</div>";
      this.orderButton.disabled = true;
      return;
    }

    this.listContainer.innerHTML = "";
    this.listContainer.replaceChildren(...items);
    this.orderButton.disabled = false;
  }

  // Устанавливает итоговую сумму покупок в корзине
  public setTotalPrice(total: number): void {
    this.totalPriceElement.textContent = `${total} синапсов`;
  }


  // Возвращает элемент корзины для вставки в DOM
  public render(): HTMLElement {
    return this.containerBasket;
  }
}