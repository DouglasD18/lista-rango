import { InvalidParamError, MissingParamError } from "@/presentation/errors";
import { ValidateProductDataAdapter } from "./validate-product-data";
import { Product } from "@/domain/models";

const sut = new ValidateProductDataAdapter();

const PRODUCT: Product = {
  photo: "any_photo_url",
  name: "product_name",
  price: 2.99,
  category: "candy",
  promotion: {
    price: 0.99,
    description: "promotion",
    daysAndHours: {
      Monday: ["18:00", "20:00"]
    }
  }
}

const { photo, name, price, category, promotion } = PRODUCT;

describe("ValidateProductData", () => {
  it("Should return a MissingParamError if name is no provided", () => {
    const validated = sut.handle({
      photo,
      price, 
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("name"));
  });

  it("Should return a MissingParamError if photo is no provided", () => {
    const validated = sut.handle({
      name,
      price, 
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("photo"));
  });

  it("Should return a MissingParamError if price is no provided", () => {
    const validated = sut.handle({
      name,
      photo, 
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("price"));
  });

  it("Should return a MissingParamError if category is no provided", () => {
    const validated = sut.handle({
      name,
      photo, 
      price
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("category"));
  });

  it("Should return a MissingParamError if promotion description is no provided", () => {
    const validated = sut.handle({
      name,
      photo, 
      price,
      category,
      promotion: {
        price: promotion.price,
        daysAndHours: promotion.daysAndHours
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("promotion description"));
  });

  it("Should return a MissingParamError if promotion price is no provided", () => {
    const validated = sut.handle({
      name,
      photo, 
      price,
      category,
      promotion: {
        description: promotion.description,
        daysAndHours: promotion.daysAndHours
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("promotion price"));
  });

  it("Should return a MissingParamError if promotion daysAndHours is no provided", () => {
    const validated = sut.handle({
      name,
      photo, 
      price,
      category,
      promotion: {
        price: promotion.price,
        description: promotion.description
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("promotion daysAndHours"));
  });

  it("Should return a InvalidParamError if category is invalid", () => {
    const validated = sut.handle({
      name,
      photo, 
      price,
      category: "pizza"
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("category", "'category' must be a valid category!"));
  });

  it("Should return a InvalidParamError if name is not a string", () => {
    const validated = sut.handle({
      price,
      name: ["Douglas"],
      photo,
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("name", "'name' must be a string!"));
  });

  it("Should return a InvalidParamError if name is not provided", () => {
    const validated = sut.handle({
      price,
      name: " ",
      photo,
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("name", "product must have a name!"));
  });

  it("Should return a InvalidParamError if photo is not a string", () => {
    const validated = sut.handle({
      price,
      name,
      photo: ["Douglas"],
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("photo", "'photo' must be a string!"));
  });

  it("Should return a InvalidParamError if photo is not provided", () => {
    const validated = sut.handle({
      price,
      name,
      photo: " ",
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("photo", "product must have a photo!"));
  });

  it("Should return a InvalidParamError if price is not a number", () => {
    const validated = sut.handle({
      price: "Sete",
      name,
      photo,
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("price", "'price' must be a number!"));
  });

  it("Should return a InvalidParamError if price is a invalid number", () => {
    const validated = sut.handle({
      price: -5.99,
      name,
      photo,
      category
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("price", "'price' must be a positive number!"));
  });

  it("Should return a InvalidParamError if promotion price is not a number", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: "18.99",
        description: promotion.description,
        daysAndHours: promotion.daysAndHours
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion price", "'price' must be a number!"));
  });

  it("Should return a InvalidParamError if promotion price is a invalid number", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: -18.99,
        description: promotion.description,
        daysAndHours: promotion.daysAndHours
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion price", "'price' must be a positive number!"));
  });

  it("Should return a InvalidParamError if promotion description is not a string", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: promotion.price,
        description: [],
        daysAndHours: promotion.daysAndHours
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion description", "'description' must be a string!"));
  });

  it("Should return a InvalidParamError if promotion description is not provided", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: promotion.price,
        description: " ",
        daysAndHours: promotion.daysAndHours
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion description", "promotion must have a description!"));
  });

  it("Should return a InvalidParamError if promotion daysAndHours have a invalid day", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: promotion.price,
        description: promotion.description,
        daysAndHours: {
          Mondays: ["18:00", "20:00"]
        }
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion daysAndHours", "'daysAndHours' must have a valid day!"));
  });

  it("Should return a InvalidParamError if promotion daysAndHours have not two hours for day", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: promotion.price,
        description: promotion.description,
        daysAndHours: {
          Monday: ["18:00", "20:00"],
          Sunday: ["20:00"]
        }
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion daysAndHours", "'daysAndHours' must have to hours for day!"));
  });

  it("Should return a InvalidParamError if promotion daysAndHours have a invalid hour", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: promotion.price,
        description: promotion.description,
        daysAndHours: {
          Monday: ["18:00", "24:60"],
          Sunday: ["20:00", "20:15"]
        }
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion daysAndHours", "'hours' must be a valid time!"));
  });

  it("Should return a InvalidParamError if promotion daysAndHours have a invalid hours difference", () => {
    const validated = sut.handle({
      price,
      name,
      photo,
      category,
      promotion: {
        price: promotion.price,
        description: promotion.description,
        daysAndHours: {
          Monday: ["18:00", "20:00"],
          Sunday: ["20:00", "20:14"]
        }
      }
    });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("promotion daysAndHours", "'hours' must have at least 15 minutes apart!"));
  });

  it("Should return true if all params are valid", () => {
    const validated = sut.handle(PRODUCT);

    expect(validated.isValid).toBe(true);
    expect(validated.error).toBeFalsy();
  })
})
