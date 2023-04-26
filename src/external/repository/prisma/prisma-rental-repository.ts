import { Rental } from '@/usecases/datatypes/rental';
import { RentalRepository } from '@/usecases/ports/rental-repository';
import prismaClient from '@/external/repository/prisma/prisma-client';

export class PrismaRentalRepository implements RentalRepository {
  async add(rental: Rental): Promise<Rental> {
    return await prismaClient.rental.create({
      data: {
        candidateId: rental.candidateId,
        bikeId: rental.bikeId,
        userId: rental.userId,
        startDate: rental.startDate,
        endDate: rental.endDate,
        rate: rental.rate,
        serviceFee: rental.serviceFee
      },
    });
  }
}
