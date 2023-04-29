import { Rent } from '@/usecases/datatypes/rent';
import { RentRepository } from '@/usecases/ports/rent-repository';

export class InMemoryRentRepository implements RentRepository {
  private rents: Rent[] = [];
  private currentId = 1;
  
  async add(rent: Rent): Promise<Rent> {
    const newRent = { ...rent, id: this.currentId++ };
    this.rents.push(newRent);
    return newRent;
  }

  async existsRentInThisPeriod(startDate: Date, endDate: Date): Promise<boolean>  {
    return this.rents.filter(rent => rent.startDate <= endDate && rent.endDate >= startDate).length > 0;
  }
}
