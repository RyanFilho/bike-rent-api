import { UseCase } from '@/usecases/ports/use-case';
import { Rental } from '@/usecases/datatypes/rental';
import { RentalRepository } from '@/usecases/ports/rental-repository';
import { CandidateRepository } from '@/usecases/ports/candidate-repository';
import { UnauthorizedError } from '@/usecases/errors/unauthorized-error';

export class CreateRental implements UseCase {
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly candidateRepository: CandidateRepository
  ) {}

  async perform(rental: Rental, candidateToken: string): Promise<Rental> {
    const candidate = await this.candidateRepository.findByToken(candidateToken);
    if (!candidate) throw new UnauthorizedError();

    //TODO:
    // - Get bike rate
    // - Calculate service fee
    // - Validate user exists
    // - Validate bike exists 

    return await this.rentalRepository.add({ ...rental, candidateId: candidate.id });
  }
}
