import prismaClient from '@/external/repository/prisma/prisma-client';
import app from '@/main/config/app';
import request from 'supertest';
import { clearPrismaDatabase } from './clear-database';
import { UserBuilder } from '@test/builders/user-builder';
import { BikeBuilder } from '@test/builders/bike-builder';
import { PrismaUserRepository } from '@/external/repository/prisma/prisma-user-repository';
import { PrismaBikeRepository } from '@/external/repository/prisma/prisma-bike-repository';

describe('Create rent route', () => {
  it('should create a new rent', async () => {
    await clearPrismaDatabase();
    const userRepo = new PrismaUserRepository();
    const bikeRepo = new PrismaBikeRepository();
    
    const candidate = await prismaClient.candidate.create({
      data: {
        email: 'first@candidate.com',
        name: 'First Candidate',
        token: 'a-token',
      },
    });

    const user = await userRepo.add({
      ...new UserBuilder().build(),
      candidateId: candidate.id,
    });

    const bike = await bikeRepo.add({
      ...new BikeBuilder().build(),
      candidateId: candidate.id,
    });

    await request(app)
      .post('/api/rents')
      .set('authorization', 'a-token')
      .send({
        bikeId: bike.id,
        userId: user.id,
        startDate: '2023-04-23T18:25:43.511Z',
        endDate: '2023-04-30T18:25:43.511Z'
      })
      .expect(201);
  });
});
