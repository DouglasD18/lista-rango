import { CreateProduct, ValidateProductData } from "@/domain/useCases";
import { badRequest, created, serverError } from "@/presentation/helpers/http";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class CreateProductController implements Controller {
  constructor(
    private createProduct: CreateProduct,
    private validateProductData: ValidateProductData
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const validated = this.validateProductData.handle(httpRequest.body);

    if (!validated.isValid) {
      return badRequest(validated.error!);
    }

    try {
      const note = await this.createProduct.handle(httpRequest.body);

      return created(note);
    } catch (error) {
      return serverError();
    }
  }

}
