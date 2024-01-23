import { Product, Validated } from "@/domain/models"
import { CreateProductController } from "./create-product"
import { CreateProduct, ValidateProductData } from "@/domain/useCases"
import { MissingParamError } from "@/presentation/errors"
import { serverError } from "@/presentation/helpers/http"

const VALIDATED: Validated = {
  isValid: true
}

const PRODUCT: Product = {
  photo: "any_photo_url",
  name: "product_name",
  price: 0.99,
  category: "candy"
}

interface SutTypes {
  sut: CreateProductController
  createProductStub: CreateProduct
  validateProductDataStub: ValidateProductData
}

const makeCreateProductStub = (): CreateProduct => {
  class CreateProductStub implements CreateProduct {
    handle(body: Product): Promise<Product> {
      return new Promise(resolve => resolve(PRODUCT));
    }
  }

  return new CreateProductStub();
}

const makeValidateProductDataStub = (): ValidateProductData => {
  class ValidateProductDataStub implements ValidateProductData {
    handle(body: any): Validated {
      return(VALIDATED);
    }
  }

  return new ValidateProductDataStub();
}

const makeSut = (): SutTypes => {
  const validateProductDataStub = makeValidateProductDataStub();
  const createProductStub = makeCreateProductStub();
  const sut = new CreateProductController(createProductStub, validateProductDataStub);

  return {
    sut,
    createProductStub,
    validateProductDataStub
  }
}

describe('CreateProduct Controller', () => {
  it("Should call ValidateProductData with correct values", async () => {
    const { sut, validateProductDataStub } = makeSut();
    const httpRequest = {
      body: PRODUCT
    }

    const validateProductDataSpy = jest.spyOn(validateProductDataStub, "handle");
    await sut.handle(httpRequest);

    expect(validateProductDataSpy).toHaveBeenCalledWith(PRODUCT);
  });

  it('Should return 400 if ValidateProductData reeturn isValid is false', async () => {
    const { sut, validateProductDataStub } = makeSut();
    const httpRequest = {
      body: PRODUCT
    }

    const validated: Validated = {
      isValid: false,
      error: new MissingParamError("category")
    }

    jest.spyOn(validateProductDataStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('category'));
  });

  it("Should call CreateProduct with correct values", async () => {
    const { sut, createProductStub } = makeSut();
    const httpRequest = {
      body: PRODUCT
    }

    const createProductSpy = jest.spyOn(createProductStub, "handle");
    await sut.handle(httpRequest);

    expect(createProductSpy).toHaveBeenCalledWith(PRODUCT);
  });

  it('Should return 500 if CreateProduct throws', async () => {
    const { sut, createProductStub } = makeSut();
    const httpRequest = {
      body: PRODUCT
    }
    
    jest.spyOn(createProductStub, "handle").mockImplementation(() => {
      throw new Error();
    })
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError());
  });

  it('Should return 201 if valid values is provided.', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: PRODUCT
    }
    
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual(PRODUCT);
  });
});