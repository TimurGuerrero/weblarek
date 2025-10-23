import { FormBase } from "./FormBase";
import { IEvents } from "../../base/Events";
import { cloneTemplate, ensureElement } from "../../../utils/utils";
import { IBuyer } from "../../../types";

export type IContactsFormData = Pick<IBuyer, "email" | "phone">;

// Класс формы Контактов
export class FormContact extends FormBase<IContactsFormData> {
  private contactsTemplate!: HTMLElement;
  private emailInput!: HTMLInputElement;
  private phoneInput!: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    // Создаём шаблон формы
    this.contactsTemplate = this.createTemplate();
  }

  // Создаёт и инициализирует шаблон формы контактов
  private createTemplate(): HTMLElement {
    const template = cloneTemplate<HTMLFormElement>("#contacts");
    this.formElement = template as HTMLFormElement;

    this.submitButton = ensureElement<HTMLButtonElement>(
      ".button",
      this.formElement
    );

    this.errorContainer = ensureElement<HTMLElement>(
      ".form__errors",
      this.formElement
    );

    // Получает элементы формы
    this.emailInput = ensureElement<HTMLInputElement>(
      "input[name='email']",
      this.formElement
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      this.formElement
    );

    this.initFields();
    this.initSubmit();

    return template;
  }

  // Возвращает готовый элемент формы
  public render(data?: IContactsFormData): HTMLElement {
    // Синхронизация с переданными данными
    if (data) {
      if (this.emailInput) {
        this.emailInput.value = data.email || "";
      }
      if (this.phoneInput) {
        this.phoneInput.value = data.phone || "";
      }
    }

    // Запрашивает валидацию при рендере
    this.events.emit("contacts:requestValidation");
    return this.contactsTemplate;
  }

  // Инициализация обработчиков полей формы
  private initFields(): void {
    if (this.emailInput) {
      this.emailInput.addEventListener("input", () => {
        this.events.emit("contacts:fieldChange", {
          field: "email",
          value: this.emailInput.value,
        });
      });
    }

    if (this.phoneInput) {
      this.phoneInput.addEventListener("input", () => {
        this.events.emit("contacts:fieldChange", {
          field: "phone",
          value: this.phoneInput.value,
        });
      });
    }
  }

  // Инициализация сабмита формы
  private initSubmit(): void {
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  // Валидация формы
  public validate(
    errors: Partial<Record<keyof IContactsFormData, string>>
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

    // нет ошибок
    if (this.errorContainer) this.errorContainer.textContent = "";
    if (this.submitButton) this.submitButton.disabled = false;
    return true;
  }

  // Проверка валидности формы
  protected checkValidity(): boolean {
    this.events.emit("contacts:requestValidation");
    return !this.submitButton.disabled;
  }

  // При успешной отправке формы — вызываем событие
  protected onSubmit(): void {}

  protected getSubmitText(): string {
    return "Оплатить";
  }
}
