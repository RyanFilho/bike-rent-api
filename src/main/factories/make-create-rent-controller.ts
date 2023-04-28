import { CreateRentController } from '@/presentation/controllers/create-rent-controller';
import { Controller } from '@/presentation/controllers/ports/controller';
import { CreateRent } from '@/usecases/create-rent';
import { makeRentRepository } from '@/main/factories/make-rent-repository';
import { makeCandidateRepository } from './make-candidate-repository';

export const makeCreateRentController = (): Controller => {
  const rentRepository = makeRentRepository();
  const candidateRepository = makeCandidateRepository();
  const useCase = new CreateRent(rentRepository, candidateRepository);
  const createCourseController = new CreateRentController(useCase);
  return createCourseController;
};
