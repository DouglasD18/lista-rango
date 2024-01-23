export type Category = "candy" | "salty" | "juice" | "dish";

export type Promotion = {
  description: string;
  price: number;
  daysAndHours: Object;
}

export interface Product {
  photo: string;
  name: string;
  price: number;
  category: Category;
  promotion?: Promotion;
}
