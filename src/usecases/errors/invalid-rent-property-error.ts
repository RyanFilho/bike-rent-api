export class InvalidRentPropertyError extends Error {
  public httpStatus = 400;
  constructor(invalidField: string) {
    super(`The value of ${invalidField} is invalid to create a rent.`);
    this.name = 'InvalidRentPropertyError';
  }
}
