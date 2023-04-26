import { UseCase } from '@/usecases/ports/use-case';
import { Controller, HttpRequest } from '@/presentation/controllers/ports';

export class CreateRentalController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<any> {
    try {
      const rental = await this.useCase.perform(request.body, request.token);
      return {
        statusCode: 201,
        body: rental,
      };
    } catch (error) {
      const userUnauthorized = error.constructor.name === 'UnauthorizedError';

      if (userUnauthorized) {
        return {
          statusCode: error.httpStatus,
          body: {
            errorType: error.constructor.name,
            message: error.message,
          },
        };
      }
      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}
