import { RentRepository } from '@/usecases/ports/rent-repository';
import prismaClient from '@/external/repository/prisma/prisma-client';
import { Rent } from '@/usecases/datatypes/rent';

export class PrismaRentRepository implements RentRepository {
  async add(rent: Rent) {
    const { candidateId, bikeId, userId, ...rentData } = rent;
    await prismaClient.rent.create({
      data: {
        candidate: {
          connect: {
            id: rent.candidateId,
          },
        },
        bike: {
          connect: {
            id: rent.bikeId,
          },
        },
        user: {
          connect: {
            id: rent.userId,
          },
        },
        ...rentData,
      },
    });
  }
}
