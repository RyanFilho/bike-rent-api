import { CreateRentController } from '@/presentation/controllers/create-rent-controller';
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports';
import { CreateRent } from '@/usecases/create-rent';
import { BikeBuilder } from '@test/builders/bike-builder';
import { CandidateBuilder } from '@test/builders/candidate-builder';
import { UserBuilder } from '@test/builders/user-builder';
import { ErrorThrowingUseCaseStub } from '@test/doubles/error-throwing-use-case-stub';
import { InMemoryBikeRepository } from '@test/doubles/in-memory-bike-repository';
import { InMemoryCandidateRepository } from '@test/doubles/in-memory-candidate-repository';
import { InMemoryRentRepository } from '@test/doubles/in-memory-rent-repository';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';

describe('Create rent controller', () => {
  it('should create a new rent', async () => {
    const addedCandidate = new CandidateBuilder().withToken().build();
    const addedUser = new UserBuilder().build();
    const addedBike = new BikeBuilder().build();
    const candidateRepository = new InMemoryCandidateRepository();
    const userRepository = new InMemoryUserRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const rentRepository = new InMemoryRentRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);
    const controller = new CreateRentController(useCase);
    const candidate = await candidateRepository.add(addedCandidate);
    const user = await userRepository.add(addedUser);
    const bike = await bikeRepository.add(addedBike);
    
    const request: HttpRequest = {
      token: candidate.token,
      body: {
        bikeId: bike.id,
        userId: user.id,
        startDate: '2023-04-23T18:25:43.511Z',
        endDate: '2023-04-30T18:25:43.511Z'
      },
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body.startDate).toEqual(new Date('2023-04-23T00:00:00.000Z'));
  });

  it('should not create overlapping rents', async () => {
    const addedCandidate = new CandidateBuilder().withToken().build();
    const addedUser = new UserBuilder().build();
    const addedBike = new BikeBuilder().build();
    const candidateRepository = new InMemoryCandidateRepository();
    const userRepository = new InMemoryUserRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const rentRepository = new InMemoryRentRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);
    const controller = new CreateRentController(useCase);
    const candidate = await candidateRepository.add(addedCandidate);
    const user = await userRepository.add(addedUser);
    const bike = await bikeRepository.add(addedBike);
    
    const request: HttpRequest = {
      token: candidate.token,
      body: {
        bikeId: bike.id,
        userId: user.id,
        startDate: '2023-04-23T18:25:43.511Z',
        endDate: '2023-04-30T18:25:43.511Z'
      },
    };

    await controller.handle(request);
    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(409);
    expect(response.body.errorType).toEqual('OverlappingRentsError');
  });

  it('should not create a new rent with invalid period', async () => {
    const addedCandidate = new CandidateBuilder().withToken().build();
    const addedUser = new UserBuilder().build();
    const addedBike = new BikeBuilder().build();
    const candidateRepository = new InMemoryCandidateRepository();
    const userRepository = new InMemoryUserRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const rentRepository = new InMemoryRentRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);
    const controller = new CreateRentController(useCase);
    const candidate = await candidateRepository.add(addedCandidate);
    const user = await userRepository.add(addedUser);
    const bike = await bikeRepository.add(addedBike);
    
    const request: HttpRequest = {
      token: candidate.token,
      body: {
        bikeId: bike.id,
        userId: user.id,
        startDate: '2023-05-30T18:25:43.511Z',
        endDate: '2023-04-30T18:25:43.511Z'
      },
    };

    await controller.handle(request);
    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(400);
    expect(response.body.errorType).toEqual('InvalidRentPeriodError');
  });

  it('should not create a new rent with invalid user', async () => {
    const addedCandidate = new CandidateBuilder().withToken().build();
    const addedUser = new UserBuilder().build();
    const addedBike = new BikeBuilder().build();
    const candidateRepository = new InMemoryCandidateRepository();
    const userRepository = new InMemoryUserRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const rentRepository = new InMemoryRentRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);
    const controller = new CreateRentController(useCase);
    const candidate = await candidateRepository.add(addedCandidate);
    const bike = await bikeRepository.add(addedBike);
    
    const request: HttpRequest = {
      token: candidate.token,
      body: {
        bikeId: bike.id,
        userId: 0,
        startDate: '2023-05-30T18:25:43.511Z',
        endDate: '2023-04-30T18:25:43.511Z'
      },
    };

    await controller.handle(request);
    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(400);
    expect(response.body.errorType).toEqual('InvalidRentPropertyError');
  });

  it('should return 500 if use case throws', async () => {
    const brokenUseCase = new ErrorThrowingUseCaseStub();
    const request: HttpRequest = {
      token: '123456',
      body: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456',
      },
    };
    const controller = new CreateRentController(brokenUseCase);

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });

  it('should return 401 if rent is unauthorized', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const userRepository = new InMemoryUserRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const rentRepository = new InMemoryRentRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);
    const controller = new CreateRentController(useCase);

    const request: HttpRequest = {
      token: '0000',
      body: {},
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(401);
  });
});
