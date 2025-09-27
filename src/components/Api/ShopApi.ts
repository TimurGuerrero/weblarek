import { Api } from "../base/Api";
import { IApi, IProduct, IOrder } from "../../types/index";

export class ShopApi extends Api implements IApi {
  getProducts(): Promise<IProduct[]> {
    return this.get<{ items: IProduct[] }>("product").then(
      (data) => data.items
    );
  }

  orderProducts(order: IOrder): Promise<IOrder> {
    return this.post<IOrder>("order", order, "POST");
  }
}
