import { Validated } from "@/domain/models";

export interface ValidateProductData {
  handle(data: any): Validated;
}
