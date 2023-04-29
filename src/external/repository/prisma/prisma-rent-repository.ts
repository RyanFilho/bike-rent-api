import { RentRepository } from '@/usecases/ports/rent-repository';
import prismaClient from '@/external/repository/prisma/prisma-client';
import { Rent } from '@/usecases/datatypes/rent';

export class PrismaRentRepository implements RentRepository {
  async add(rent: Rent): Promise<Rent> {
    const { candidateId, bikeId, userId, id, ...rentData } = rent;
    const prismaRent = await prismaClient.rent.create({
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

    const rentAdded: Rent = {
      id: prismaRent.id,
      candidateId: prismaRent.candidateId,
      bikeId: prismaRent.bikeId,
      userId: prismaRent.userId,
      startDate: prismaRent.startDate,
      endDate: prismaRent.endDate,
      serviceFee: Number(prismaRent.serviceFee.toString()),
      totalCharge: Number(prismaRent.totalCharge.toString()),
    }
    return rentAdded;
  }

  async existsRentInThisPeriod(startDate: Date, endDate: Date): Promise<boolean> {
    const result = await prismaClient.rent.count({
      take: 1,
      where: {
        AND: [
          {
            startDate: {
              lte: endDate
            }
          },
          {
            endDate: {
              gte: startDate
            }
          }
        ],
      },
    });
    return result > 0;
  }
}
