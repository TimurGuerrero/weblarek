import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ShoppingCartModel {
  private cart: IProduct[] = [];
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.cart;
  }

  addItem(item: IProduct): void {
    if (!this.isInCart(item.id)) {
      this.cart.push(item);
      this.events.emit("cart:changed");
    }
  }

  removeItem(item: IProduct): void {
    this.cart = this.cart.filter((p) => p.id !== item.id);
    this.events.emit("cart:changed");
  }

  clear(): void {
    this.cart = [];
    this.events.emit("cart:changed");
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.cart.length;
  }

  isInCart(id: string): boolean {
    return this.cart.some((item) => item.id === id);
  }
}
