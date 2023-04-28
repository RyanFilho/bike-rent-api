import { RentRepository } from '@/usecases/ports/rent-repository';
import prismaClient from '@/external/repository/prisma/prisma-client';
import { RentData } from '@/usecases/datatypes/rent-data';

export class PrismaRentRepository implements RentRepository {
  async add(rent: RentData) {
   await prismaClient.rent.create({
      data: {
        candidateId: rent.candidateId,
        bikeId: rent.bikeId,
        userId: rent.userId,
        startDate: rent.startDate,
        endDate: rent.endDate,
        serviceFee: rent.serviceFee,
        totalCharge: rent.totalCharge,
      },
    });
  }
}
