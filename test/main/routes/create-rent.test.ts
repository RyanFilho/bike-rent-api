import prismaClient from '@/external/repository/prisma/prisma-client';
import app from '@/main/config/app';
import request from 'supertest';
import { clearPrismaDatabase } from './clear-database';

describe('Create rent route', () => {
  it('should create a new rent', async () => {
    await clearPrismaDatabase();

    await prismaClient.candidate.create({
      data: {
        email: 'first@candidate.com',
        name: 'First Candidate',
        token: 'a-token',
      },
    });

    await request(app)
      .post('/api/rents')
      .set('authorization', 'a-token')
      .send({
        bikeId: 36,
        userId: 9,
        startDate: '2023-04-23T18:25:43.511Z',
        endDate: '2023-04-30T18:25:43.511Z'
      })
      .expect(201);
  });
});
