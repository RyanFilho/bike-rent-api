import { UseCase } from '@/usecases/ports/use-case';
import { Rent } from '@/usecases/datatypes/rent';
import { RentRepository } from '@/usecases/ports/rent-repository';
import { CandidateRepository } from '@/usecases/ports/candidate-repository';
import { BikeRepository } from '@/usecases/ports/bike-repository';
import { UserRepository } from '@/usecases/ports/user-repository';
import { UnauthorizedError } from '@/usecases/errors/unauthorized-error';

export class CreateRent implements UseCase {
  constructor(
    private readonly rentRepository: RentRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(rent: Rent, candidateToken: string): Promise<Rent> {
    const candidate = await this.candidateRepository.findByToken(candidateToken);
    if (!candidate) throw new UnauthorizedError();

    const bike = await this.bikeRepository.findById(rent.bikeId, candidate.id);
    if (!candidate) throw new UnauthorizedError();

    const user = await this.userRepository.findById(rent.userId, candidate.id);
    if (!candidate) throw new UnauthorizedError();

    //TODO:
    // - Get bike rate
    // - Calculate service fee
    // - Validate user exists
    // - Validate bike exists 
    rent.candidateId = candidate.id;
    rent.rate = bike.rate;
    const daysRented = Math.ceil((rent.startDate.getTime() - rent.endDate.getTime()) / (1000 * 60 * 60 * 24));
    rent.rentRate = bike.rate * daysRented;
    rent.totalCharged = bike.rate;

    return await this.rentRepository.add({ ...rent, candidateId: candidate.id });
  }
}
