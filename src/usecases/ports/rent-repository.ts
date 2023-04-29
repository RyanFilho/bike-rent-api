import { Rent } from '@/usecases/datatypes/rent';

export interface RentRepository {
  add(rent: Rent): Promise<Rent>;
  existsRentInThisPeriod(startDate: Date, endDate: Date): Promise<boolean>;
}
