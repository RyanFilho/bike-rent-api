import { PrismaRentRepository } from '@/external/repository/prisma/prisma-rent-repository';
import { PrismaCandidateRepository } from '@/external/repository/prisma/prisma-candidate-repository';
import { PrismaUserRepository } from '@/external/repository/prisma/prisma-user-repository';
import { PrismaBikeRepository } from '@/external/repository/prisma/prisma-bike-repository';
import { RentBuilder } from '@test/builders/rent-builder';
import { BikeBuilder } from '@test/builders/bike-builder';
import { UserBuilder } from '@test/builders/user-builder';
import { clearPrismaDatabase } from '@test/main/routes/clear-database';

describe('Rent prisma repository', () => {
  it('should be able to list rents', async () => {
    await clearPrismaDatabase();
    const candidateRepo = new PrismaCandidateRepository();
    const userRepo = new PrismaUserRepository();
    const bikeRepo = new PrismaBikeRepository();
    const repo = new PrismaRentRepository();

    const candidate = await candidateRepo.add({
      name: 'any_name',
      email: 'any_email',
      token: 'any_token',
    });

    const user = await userRepo.add({
      ...new UserBuilder().build(),
      candidateId: candidate.id,
    });

    const bike = await bikeRepo.add({
      ...new BikeBuilder().build(),
      candidateId: candidate.id,
    });

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-02-01');

    const rentInfo = new RentBuilder()
      .withDates(startDate, endDate)
      .build();

    await repo.add({
      ...rentInfo,
      candidateId: candidate.id,
      userId: user.id,
      bikeId: bike.id,
    });

    const shouldExists = await repo.existsRentInThisPeriod(startDate, endDate);
    const shouldNotExists = await repo.existsRentInThisPeriod(new Date('2020-01-01'), new Date('2020-02-01'));
    
    expect(shouldExists).toBeTruthy();
    expect(shouldNotExists).toBeFalsy();
  });
});
