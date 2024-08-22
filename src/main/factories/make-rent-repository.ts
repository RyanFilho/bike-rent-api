import { PrismaRentRepository } from '@/external/repository/prisma/prisma-rent-repository';
import { RentRepository } from '@/usecases/ports/rent-repository';

export const makeRentRepository = (): RentRepository => {
  return new PrismaRentRepository();
};
