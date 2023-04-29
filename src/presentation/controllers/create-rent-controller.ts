import { UseCase } from '@/usecases/ports/use-case';
import { Controller, HttpRequest } from '@/presentation/controllers/ports';

export class CreateRentController implements Controller {
  constructor(private readonly useCase: UseCase) {}

  async handle(request: HttpRequest): Promise<any> {
    try {
      const rent = await this.useCase.perform(request.body, request.token);
      return {
        statusCode: 201,
        body: rent,
      };
    } catch (error) {
      const userUnauthorized = error.constructor.name === 'UnauthorizedError';
      const invalidRentPeriodError = error.constructor.name === 'InvalidRentPeriodError';
      const invalidRentPropertyError = error.constructor.name === 'InvalidRentPropertyError';
      const overlappingRentsError = error.constructor.name === 'OverlappingRentsError';

      if (userUnauthorized || invalidRentPeriodError || invalidRentPropertyError || overlappingRentsError) {
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
        body: String(error),
      };
    }
  }
}
