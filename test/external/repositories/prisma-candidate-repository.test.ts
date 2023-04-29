import { PrismaCandidateRepository } from '@/external/repository/prisma/prisma-candidate-repository';
import { CandidateBuilder } from '@test/builders/candidate-builder';
import { clearPrismaDatabase } from '@test/main/routes/clear-database';

describe('Candidate prisma repository', () => {
  it('should be able to find by email', async () => {
    await clearPrismaDatabase();
    const repo = new PrismaCandidateRepository();

    const candidateInfo = new CandidateBuilder().withToken().build();
    await repo.add(candidateInfo);

    const candidates = await repo.findByEmail(candidateInfo.email);

    expect(candidates.email).toBe(candidateInfo.email);
  });

  it('should be able to find by token', async () => {
    await clearPrismaDatabase();
    const repo = new PrismaCandidateRepository();

    const candidateInfo = new CandidateBuilder().withToken().build();
    await repo.add(candidateInfo);

    const candidates = await repo.findByToken(candidateInfo.token);

    expect(candidates.token).toBe(candidateInfo.token);
  });

  it('should be able return undefined when don\'t find by token', async () => {
    await clearPrismaDatabase();
    const repo = new PrismaCandidateRepository();

    const candidates = await repo.findByToken('teste');

    expect(candidates).toBeUndefined();
  });
});
