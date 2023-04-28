import { Rent } from '@/usecases/datatypes/rent';
import { RentRepository } from '@/usecases/ports/rent-repository';
import prismaClient from '@/external/repository/prisma/prisma-client';

export class PrismaRentRepository implements RentRepository {
  async add(rent: Rent): Promise<Rent> {
    return await prismaClient.rent.create({
      data: {
        candidateId: rent.candidateId,
        bikeId: rent.bikeId,
        userId: rent.userId,
        startDate: rent.startDate,
        endDate: rent.endDate,
        rate: rent.rate,
        serviceFee: rent.serviceFee
      },
    });
  }
}
