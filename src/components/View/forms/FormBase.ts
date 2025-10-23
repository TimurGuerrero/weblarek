import { Component } from "../../base/Component";
import { IBuyer } from "../../../types";
import { IEvents } from "../../base/Events";

// Абстрактный класс формы
export abstract class FormBase<T extends Partial<IBuyer>> extends Component<T> {
  protected formElement!: HTMLFormElement;
  protected errorContainer!: HTMLElement;
  protected submitButton!: HTMLButtonElement;
  protected events: IEvents;
  protected fieldsToValidate: (keyof IBuyer)[] = [];

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.init();
  }

  // Инициализация обработчиков формы
  protected init(): void {
    if (!this.formElement) return;

    // Обработчик отправки формы
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.checkValidity()) {
        this.onSubmit();
      }
    });

    // Проверка валидности при вводе в поля
    this.formElement.addEventListener("input", () => {
      this.checkValidity();
    });

    // Задаём текст кнопки отправки
    this.setSubmitButtonText();
  }

  // Устанавливает текст кнопки сабмита
  protected setSubmitButtonText() {
    if (this.submitButton) {
      this.submitButton.textContent = this.getSubmitText();
    }
  }

  // Возвращает текст кнопки отправки
  protected abstract getSubmitText(): string;

  // Действия при успешной отправке формы
  protected abstract onSubmit(): void;

  // Проверка валидности всех полей формы
  protected abstract checkValidity(): boolean;

  // Сброс формы
  protected resetForm?(): void;
}