import { faker } from "@faker-js/faker";

export type User = {
  id: string;
  slNo: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  comments: string;
};

function randomId8(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createUser(numUser: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < numUser; i++) {
    users.push({
      id: randomId8(),
      slNo: i + 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 90 }),
      email: faker.internet.email(),
      comments: faker.lorem.sentences(3),
    });
  }
  return users;
}
