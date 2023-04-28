import { UseCase } from '@/usecases/ports/use-case';
import { RentRequest } from '@/usecases/datatypes/rent-request';
import { RentRepository } from '@/usecases/ports/rent-repository';
import { CandidateRepository } from '@/usecases/ports/candidate-repository';
import { BikeRepository } from '@/usecases/ports/bike-repository';
import { UserRepository } from '@/usecases/ports/user-repository';
import { UnauthorizedError } from '@/usecases/errors/unauthorized-error';
import { Rent } from '@/entities/rent';

export class CreateRent implements UseCase {
  constructor(
    private readonly rentRepository: RentRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly userRepository: UserRepository
  ) {}

  async perform(rentRequest: RentRequest, candidateToken: string) {
    const candidate = await this.candidateRepository.findByToken(candidateToken);
    if (!candidate) throw new UnauthorizedError();

    const bike = await this.bikeRepository.findById(rentRequest.bikeId);
    if (!bike) throw new UnauthorizedError();

    const user = await this.userRepository.findById(rentRequest.userId);
    if (!user) throw new UnauthorizedError();

    rentRequest.candidateId = candidate.id;

    var entity = new Rent(rentRequest);

    await this.rentRepository.add({ ...entity });
  }
}
