import { FormBase } from "./FormBase";
import { IEvents } from "../../base/Events";
import { cloneTemplate, ensureElement } from "../../../utils/utils";
import { IBuyer, TPayment } from "../../../types";

export type IOrderFormData = Pick<IBuyer, "payment" | "address">;

export class FormOrder extends FormBase<IOrderFormData> {
  private orderTemplate!: HTMLElement;
  private paymentButtons: HTMLButtonElement[] = [];
  private addressInput!: HTMLInputElement;
  private selectedPayment: TPayment | null = null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.orderTemplate = this.createTemplate();
  }

  private createTemplate(): HTMLElement {
    const template = cloneTemplate<HTMLFormElement>("#order");
    this.formElement = template as HTMLFormElement;

    this.submitButton = ensureElement<HTMLButtonElement>(
      ".order__button",
      this.formElement
    );

    this.errorContainer = ensureElement<HTMLElement>(
      ".form__errors",
      this.formElement
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      "input[name='address']",
      this.formElement
    );

    this.fieldsToValidate = ["payment", "address"];
    this.initFields();
    this.initSubmit();

    return template;
  }

  public render(data?: IOrderFormData): HTMLElement {
    // Синхронизация с переданными данными
    if (data) {
      // Синхронизация способа оплаты
      this.selectedPayment = data.payment as TPayment;
      this.updatePaymentButtons();

      // Синхронизация адреса
      if (this.addressInput) {
        this.addressInput.value = data.address || "";
      }
    }

    // Запрашиваем валидацию при рендере
    this.events.emit("order:requestValidation");
    return this.orderTemplate;
  }

  private getPaymentButtons(): HTMLButtonElement[] {
    if (this.paymentButtons.length === 0) {
      this.paymentButtons = Array.from(
        this.formElement.querySelectorAll<HTMLButtonElement>(
          "button[name='card'], button[name='cash']"
        )
      );
    }
    return this.paymentButtons;
  }

  private updatePaymentButtons(): void {
    this.getPaymentButtons().forEach((btn) => {
      if (btn.name === this.selectedPayment) {
        btn.style.backgroundColor = "#5F8CC7";
      } else {
        btn.style.backgroundColor = "";
      }
    });
  }

  private initFields(): void {
    const paymentButtons = this.getPaymentButtons();

    paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.selectedPayment = button.name as TPayment;
        this.updatePaymentButtons();
        this.events.emit("order:paymentChange", {
          payment: this.selectedPayment,
        });
        this.events.emit("order:requestValidation");
      });
    });

    if (this.addressInput) {
      this.addressInput.addEventListener("input", () => {
        this.events.emit("order:addressChange", {
          address: this.addressInput.value,
        });
        this.events.emit("order:requestValidation");
      });
    }
  }

  // Инициализация сабмита формы
  private initSubmit(): void {
    if (!this.formElement) return;
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("FormOrder: submit clicked");
      // запрос валидации через events, затем эмитируем итоговый submit
      this.events.emit("order:requestValidation");
      // небольшой таймаут, чтобы успеть получить валидацию через events (или слушать результат)
      setTimeout(() => {
        // после валидации форма сама решает отправлять или нет, но для простоты — эмитим
        this.events.emit("order:submit");
      }, 0);
    });

    // также на кнопку кликаем на случай если у вас нет <form>
    if (this.submitButton) {
      this.submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("FormOrder: submit button clicked");
        this.events.emit("order:requestValidation");
        setTimeout(() => this.events.emit("order:submit"), 0);
      });
    }
  }

  // Валидация формы
  public validate(
    errors: Partial<Record<keyof IOrderFormData, string>>
  ): boolean {
    const errorMessages = Object.values(errors).filter(Boolean);

    if (errorMessages.length > 0) {
      const message =
        errorMessages.length > 1
          ? "Необходимо заполнить все поля"
          : errorMessages.join(". ");
      if (this.errorContainer) this.errorContainer.textContent = message;
      if (this.submitButton) this.submitButton.disabled = true;
      return false;
    }

    if (this.errorContainer) this.errorContainer.textContent = "";
    if (this.submitButton) this.submitButton.disabled = false;
    return true;
  }

  protected checkValidity(): boolean {
    this.events.emit("order:requestValidation");
    return !this.submitButton.disabled;
  }

  protected onSubmit(): void {}

  protected getSubmitText(): string {
    return "Далее";
  }
}
