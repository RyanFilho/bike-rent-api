import { RentRequest } from "../usecases/datatypes/rent-request";

export class Rent {
  public readonly candidateId: number;
  public readonly bikeId: number;
  public readonly userId: number;
  public readonly startDate: Date;
  public readonly endDate: Date;
  public readonly serviceFee: number;
  public readonly totalCharge: number;

  public constructor(rent: RentRequest) {
    this.candidateId = rent.candidateId;
    this.bikeId = rent.bikeId;
    this.userId = rent.userId;
    this.startDate = rent.startDate;
    this.endDate = rent.endDate;

    const daysRented = this.getDaysDiff(rent.startDate, rent.endDate);
    var rentRate = rent.bikeRate * daysRented;

    this.serviceFee = rentRate * 0.15;
    this.totalCharge = rentRate + this.serviceFee;

    Object.freeze(this)
  }

  private getDaysDiff(startDate: Date, endDate: Date) {
    const startWithoutTime = new Date(startDate.toDateString());
    const endWithoutTime = new Date(endDate.toDateString());
    const daysDiff = Math.ceil((startWithoutTime.getTime() - endWithoutTime.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff;
  }
}
