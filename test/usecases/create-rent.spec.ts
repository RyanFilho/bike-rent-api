import { CreateRent } from '@/usecases/create-rent';
import { Rent } from '@/usecases/datatypes/rent';
import { CandidateBuilder } from '@test/builders/candidate-builder';
import { InMemoryCandidateRepository } from '@test/doubles/in-memory-candidate-repository';
import { InMemoryRentRepository } from '@test/doubles/in-memory-rent-repository';
import { InMemoryBikeRepository } from '@test/doubles/in-memory-bike-repository';
import { InMemoryUserRepository } from '@test/doubles/in-memory-user-repository';
import { BikeBuilder } from '@test/builders/bike-builder';
import { UserBuilder } from '@test/builders/user-builder';
import { InvalidRentPeriodError } from '@/usecases/errors/invalid-rent-period-error';
import { InvalidRentPropertyError } from '@/usecases/errors/invalid-rent-property-error';
import { OverlappingRentsError } from '@/usecases/errors/overlapping-rents-error';
import { RentBuilder } from '@test/builders/rent-builder';

describe('Create rent use case', () => {
  it('should create a new rent', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedUser = new UserBuilder().withId().build();
    const user = await userRepository.add(addedUser);

    const addedBike = new BikeBuilder().withId().build();
    const bike = await bikeRepository.add(addedBike);

    const request: Rent = {
      bikeId: bike.id,
      userId: user.id,
      startDate: new Date('2023-04-23T18:25:43.511Z'),
      endDate: new Date('2023-04-30T18:25:43.511Z'),
      serviceFee: null,
      totalCharge: null
    };

    const rent = await useCase.perform(request, candidate.token);

    expect(rent.bikeId).toEqual(addedBike.id);
    expect(rent.userId).toEqual(addedUser.id);
    expect(rent.candidateId).toEqual(addedCandidate.id);
    expect(rent.startDate).toEqual(new Date('2023-04-23'));
    expect(rent.endDate).toEqual(new Date('2023-04-30'));
  });

  it('should create a new rent with 15% service fee', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedUser = new UserBuilder().withId().build();
    const user = await userRepository.add(addedUser);

    const addedBike = new BikeBuilder().withId().build();
    const bike = await bikeRepository.add(addedBike);
    bike.rate = 123;

    const request: Rent = {
      bikeId: bike.id,
      userId: user.id,
      startDate: new Date('2023-01-01T18:25:43.511Z'),
      endDate: new Date('2023-01-30T18:25:43.511Z'),
      serviceFee: null,
      totalCharge: null
    };

    const rent = await useCase.perform(request, candidate.token);

    expect(rent.serviceFee).toEqual(535.05);
  });

  it('should not create a new rent with invalid period', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedUser = new UserBuilder().withId().build();
    const user = await userRepository.add(addedUser);

    const addedBike = new BikeBuilder().withId().build();
    const bike = await bikeRepository.add(addedBike);

    const request: Rent = {
      bikeId: bike.id,
      userId: user.id,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-01-01'),
      serviceFee: null,
      totalCharge: null
    };

    await expect(useCase.perform(request, candidate.token)).rejects.toThrow(InvalidRentPeriodError);
  });

  it('should not create rent with invalid bike', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedUser = new UserBuilder().withId().build();
    const user = await userRepository.add(addedUser);

    const request: Rent = {
      bikeId: 0,
      userId: user.id,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-01-01'),
      serviceFee: null,
      totalCharge: null
    };

    await expect(useCase.perform(request, candidate.token)).rejects.toThrow(InvalidRentPropertyError);
  });

  it('should not create rent with invalid user', async () => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedBike = new BikeBuilder().withId().build();
    const bike = await bikeRepository.add(addedBike);

    const request: Rent = {
      bikeId: bike.id,
      userId: 0,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2023-01-01'),
      serviceFee: null,
      totalCharge: null
    };

    await expect(useCase.perform(request, candidate.token)).rejects.toThrow(InvalidRentPropertyError);
  });

  it.each([
    [new Date('2023-01-01'), new Date('2023-01-02'), new Date('2023-01-01'), new Date('2023-01-02')],
    [new Date('2023-01-01'), new Date('2023-03-01'), new Date('2023-02-01'), new Date('2023-02-10')],
    [new Date('2023-01-01'), new Date('2023-02-01'), new Date('2023-01-20'), new Date('2023-03-01')],
    [new Date('2023-01-01'), new Date('2023-02-01'), new Date('2022-12-01'), new Date('2023-01-15')]
  ])('should not create overlapping rents', async (existingStart: Date, existingEnd: Date, newStart: Date, newEnd: Date) => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();

    const addedRent = new RentBuilder().withDates(existingStart, existingEnd).build();
    await rentRepository.add(addedRent);

    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedBike = new BikeBuilder().withId().build();
    const bike = await bikeRepository.add(addedBike);

    const addedUser = new UserBuilder().withId().build();
    const user = await userRepository.add(addedUser);

    const request: Rent = {
      bikeId: bike.id,
      userId: user.id,
      startDate: newStart,
      endDate: newEnd,
      serviceFee: null,
      totalCharge: null
    };

    await expect(useCase.perform(request, candidate.token)).rejects.toThrow(OverlappingRentsError);
  });

  it.each([
    [new Date('2020-01-01'), new Date('2020-01-02'), new Date('2023-01-01'), new Date('2023-01-02')],
    [new Date('2024-01-01'), new Date('2024-03-01'), new Date('2023-02-01'), new Date('2023-02-10')]
  ])('should create not overlapping rents', async (existingStart: Date, existingEnd: Date, newStart: Date, newEnd: Date) => {
    const candidateRepository = new InMemoryCandidateRepository();
    const rentRepository = new InMemoryRentRepository();
    const bikeRepository = new InMemoryBikeRepository();
    const userRepository = new InMemoryUserRepository();

    const addedRent = new RentBuilder().withDates(existingStart, existingEnd).build();
    await rentRepository.add(addedRent);

    const useCase = new CreateRent(rentRepository, candidateRepository, bikeRepository, userRepository);

    const addedCandidate = new CandidateBuilder().withId().withToken().build();
    const candidate = await candidateRepository.add(addedCandidate);

    const addedBike = new BikeBuilder().withId().build();
    const bike = await bikeRepository.add(addedBike);

    const addedUser = new UserBuilder().withId().build();
    const user = await userRepository.add(addedUser);

    const request: Rent = {
      bikeId: bike.id,
      userId: user.id,
      startDate: newStart,
      endDate: newEnd,
      serviceFee: null,
      totalCharge: null
    };
    const rentCreated = await useCase.perform(request, candidate.token);
    await expect(rentCreated.startDate).toEqual(newStart);
  });
});
