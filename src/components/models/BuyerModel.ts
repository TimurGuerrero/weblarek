import { IBuyer } from "../../types";

export class BuyerModel {
  private data: Partial<IBuyer> = {};

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

    return errors as Record<keyof IBuyer, string>;
  }
}
