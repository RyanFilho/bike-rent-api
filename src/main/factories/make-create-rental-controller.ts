import { CreateRentalController } from '@/presentation/controllers/create-rental-controller';
import { Controller } from '@/presentation/controllers/ports/controller';
import { CreateRental } from '@/usecases/create-rental';
import { makeRentalRepository } from '@/main/factories/make-rental-repository';
import { makeCandidateRepository } from './make-candidate-repository';

export const makeCreateRentalController = (): Controller => {
  const rentalRepository = makeRentalRepository();
  const candidateRepository = makeCandidateRepository();
  const useCase = new CreateRental(rentalRepository, candidateRepository);
  const createCourseController = new CreateRentalController(useCase);
  return createCourseController;
};
