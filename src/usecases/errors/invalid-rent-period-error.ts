export class InvalidRentPeriodError extends Error {
  public httpStatus = 400;
  constructor(startDate: Date, endDate: Date) {
    super(`Rent with start date ${startDate} and end date ${endDate} is invalid.`);
    this.name = 'InvalidRentPeriodError';
  }
}
