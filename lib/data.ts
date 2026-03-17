import { faker } from "@faker-js/faker";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  comments: string;
};

export function createUser(numUser: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < numUser; i++) {
    users.push({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 90 }),
      email: faker.internet.email(),
      comments: faker.lorem.sentences(3),
    });
  }
  return users;
}
