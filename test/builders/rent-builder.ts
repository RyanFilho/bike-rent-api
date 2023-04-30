import { Rent } from '@/usecases/datatypes/rent';

export class RentBuilder {
  private rent: Rent = {
    bikeId: 1,
    userId: 1,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-11'),
    serviceFee: 15,
    totalCharge: 115,
  };

  withId(): RentBuilder {
    this.rent.id = 1;
    return this;
  }

  withCandidateId(): RentBuilder {
    this.rent.candidateId = 1;
    return this;
  }

  withDates(startDate: Date, endDate: Date): RentBuilder {
    this.rent.startDate = startDate;
    this.rent.endDate = endDate;
    return this;
  }

  build(): Rent {
    return this.rent;
  }
}
