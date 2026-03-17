import { randomBytes } from "node:crypto";
import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "lib", "mock-users.json");

function randomId8() {
  return randomBytes(4).toString("hex");
}

const COUNT = 10_000;
faker.seed(42);

const data = Array.from({ length: COUNT }, (_, i) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: randomId8(),
    firstName,
    lastName,
    age: faker.number.int({ min: 18, max: 90 }),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    comments: faker.lorem.paragraph({ min: 2, max: 4 }),
  };
});

writeFileSync(outPath, JSON.stringify(data), "utf-8");
console.log(`Wrote ${data.length} users to lib/mock-users.json`);
