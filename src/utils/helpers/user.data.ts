import { faker } from "@faker-js/faker";

export function generateOnboardingData() {

  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();

  const userData = {
    firstname,
    lastname,
    email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@yopmail.com`,
    pin: faker.finance.pin(6),
  };

  return { userData };
}
