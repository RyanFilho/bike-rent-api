import { User } from '@/usecases/datatypes/user';

export class UserBuilder {
  private user: User = {
    name: 'Ryan Son',
    email: 'ryan@son.com',
    password: '654321',
  };

  withId(): UserBuilder {
    this.user.id = 1;
    return this;
  }

  withCandidateId(): UserBuilder {
    this.user.candidateId = 1;
    return this;
  }

  build(): User {
    return this.user;
  }
}
