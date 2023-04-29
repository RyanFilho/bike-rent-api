export class OverlappingRentsError extends Error {
  public httpStatus = 400;
  constructor(startDate: Date, endDate: Date) {
    super(`Rent with dates between ${startDate} and ${endDate} already exists for this bike.`);
    this.name = 'OverlappingRentsError';
  }
}
