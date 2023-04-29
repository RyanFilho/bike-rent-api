import { PrismaRentRepository } from '@/external/repository/prisma/prisma-rent-repository';
import { PrismaCandidateRepository } from '@/external/repository/prisma/prisma-candidate-repository';
import { PrismaUserRepository } from '@/external/repository/prisma/prisma-user-repository';
import { PrismaBikeRepository } from '@/external/repository/prisma/prisma-bike-repository';
import { RentBuilder } from '@test/builders/rent-builder';
import { BikeBuilder } from '@test/builders/bike-builder';
import { UserBuilder } from '@test/builders/user-builder';
import { clearPrismaDatabase } from '@test/main/routes/clear-database';

describe('Rent prisma repository', () => {
  it('should be able to verify if bike is available', async () => {
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

    const rentAdded = await repo.add({
      ...rentInfo,
      candidateId: candidate.id,
      userId: user.id,
      bikeId: bike.id,
    });
    
    const shouldBe = await repo.isBikeAvailable(rentAdded);
    var otherRent = {
      ...rentInfo,
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-02-01')
    }
    const shouldNotBe = await repo.isBikeAvailable(otherRent);
    
    expect(shouldBe).toBeTruthy();
    expect(shouldNotBe).toBeFalsy();
  });
});
