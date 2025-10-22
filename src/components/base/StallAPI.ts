import { IApi, IProduct, IOrderRequest, IOrderResponse } from "../../types";

export class StallAPI {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение товаров с сервера []
  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>("/product/");
    return response.items;
  }

  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}
