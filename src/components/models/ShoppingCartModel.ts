import { IProduct } from "../../types";

export class ShoppingCartModel {
  private cart: IProduct[] = [];

  getItems(): IProduct[] {
    return this.cart;
  }

  addItem(item: IProduct): void {
    if (!this.isInCart(item.id)) {
      this.cart.push(item);
    }
  }

  removeItem(item: IProduct): void {
    this.cart = this.cart.filter((p) => p.id !== item.id);
  }

  clear(): void {
    this.cart = [];
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
