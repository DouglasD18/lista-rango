import { Product } from "@/domain/models";

export interface CreateProduct {
  handle(product: Product): Promise<Product>;
}
