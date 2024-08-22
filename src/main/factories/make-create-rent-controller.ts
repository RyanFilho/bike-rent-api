import { CreateRentController } from '@/presentation/controllers/create-rent-controller';
import { Controller } from '@/presentation/controllers/ports/controller';
import { CreateRent } from '@/usecases/create-rent';
import { makeRentRepository } from '@/main/factories/make-rent-repository';
import { makeCandidateRepository } from '@/main/factories/make-candidate-repository';
import { makeBikeRepository } from '@/main/factories/make-bike-repository';
import { makeUserRepository } from '@/main/factories/make-user-repository';

export const makeCreateRentController = (): Controller => {
  const rentRepository = makeRentRepository();
  const candidateRepository = makeCandidateRepository();
  const bikeRepository = makeBikeRepository();
  const userRepository = makeUserRepository();
  const useCase = new CreateRent(
    rentRepository,
    candidateRepository,
    bikeRepository,
    userRepository
  );
  const createCourseController = new CreateRentController(useCase);
  return createCourseController;
};
