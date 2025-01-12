import { faker } from "@faker-js/faker";

export function generateOnboardingData() {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const sex = faker.person.sexType();
  const location = faker.location.country();
  const dob = faker.date
    .birthdate({ mode: "year", min: 1950, max: 2007 })
    .toISOString()
    .split("T")[0];

  const userData = {
    firstname,
    lastname,
    email: `${firstname.toLowerCase()}.${lastname.toLowerCase()}@yopmail.com`,
    pin: faker.finance.pin({ length: 6 }),
    sex: sex,
    location: location,
    dob: dob,
  };

  return { userData };
}
