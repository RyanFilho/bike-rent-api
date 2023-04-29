import { UseCase } from '@/usecases/ports/use-case';
import { Rent } from '@/usecases/datatypes/rent';
import { RentRepository } from '@/usecases/ports/rent-repository';
import { CandidateRepository } from '@/usecases/ports/candidate-repository';
import { BikeRepository } from '@/usecases/ports/bike-repository';
import { UserRepository } from '@/usecases/ports/user-repository';
import { UnauthorizedError } from '@/usecases/errors/unauthorized-error';
import { InvalidRentPeriodError } from './errors/invalid-rent-period-error';
import { InvalidRentPropertyError } from './errors/invalid-rent-property-error';
import { OverlappingRentsError } from './errors/overlapping-rents-error';

export class CreateRent implements UseCase {
  constructor(
    private readonly rentRepository: RentRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly userRepository: UserRepository
  ) { }

  async perform(rent: Rent, candidateToken: string): Promise<Rent> {
    const candidate = await this.candidateRepository.findByToken(candidateToken);
    if (!candidate) throw new UnauthorizedError();

    const bike = await this.bikeRepository.findById(rent.bikeId);
    if (!bike) throw new InvalidRentPropertyError('bikeId');

    const user = await this.userRepository.findById(rent.userId);
    if (!user) throw new InvalidRentPropertyError('userId');

    if (rent.startDate >= rent.endDate) throw new InvalidRentPeriodError(rent.startDate, rent.endDate);

    if (await this.rentRepository.isBikeAvailable(rent)) throw new OverlappingRentsError(rent.startDate, rent.endDate);

    rent.candidateId = candidate.id;
    rent.startDate = this.getDateWithoutTime(new Date(rent.startDate));
    rent.endDate = this.getDateWithoutTime(new Date(rent.endDate));
    const rentRate = await this.getRentRate(rent, bike.rate);
    rent.serviceFee = rentRate * 0.15;
    rent.totalCharge = rentRate + rent.serviceFee;

    return this.rentRepository.add(rent);
  }

  private async getRentRate(rent: Rent, ratePerDay: number) {
    const dayInMilliseconds = 1000 * 60 * 60 * 24;
    const days = Math.abs((rent.endDate.getTime() - rent.startDate.getTime()) / dayInMilliseconds);
    const result = days * ratePerDay;
    return result;
  }

  private getDateWithoutTime(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
}
