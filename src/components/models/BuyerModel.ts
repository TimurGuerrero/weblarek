import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  protected data: Partial<IBuyer> = {};

  setData(newData: Partial<IBuyer>): void {
    this.data = { ...this.data, ...newData };
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  validate(): Record<keyof IBuyer, string> {
    const errors: Record<string, string> = {};

    if (!this.data.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.data.address) errors.address = "Укажите адрес доставки";
    if (!this.data.email) errors.email = "Укажите email";
    if (!this.data.phone) errors.phone = "Укажите телефон";

    return errors;
  }

  isComplete(): boolean {
    const d = this.data;
    return !!(d.payment && d.email && d.phone && d.address);
  }
}

export class Buyer extends BuyerModel {
  constructor(private events: IEvents) {
    super();
  }

  setPayment(payment: TPayment): void {
    this.setData({ payment });
  }

  setEmail(email: string): void {
    this.setData({ email });
  }

  setPhone(phone: string): void {
    this.setData({ phone });
  }

  setAddress(address: string): void {
    this.setData({ address });
    if (address.length > 100) {
      throw new Error("Address length exceeds 100 characters");
    }
  }

  // Проверка валидации заказа
  requestOrderValidation(): void {
    const validation = this.validate();
    this.events.emit("order:validate", validation);
  }

  // Проверка валидации контактов
  requestContactsValidation(): void {
    const validation = this.validate();
    this.events.emit("contacts:validate", validation);
  }
}
