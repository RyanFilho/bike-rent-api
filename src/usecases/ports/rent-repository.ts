import { Rent } from '@/usecases/datatypes/rent';

export interface RentRepository {
  add(rent: Rent): Promise<Rent>;
  isBikeAvailable(rent: Rent): Promise<boolean>;
}
