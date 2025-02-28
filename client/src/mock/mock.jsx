import { faker } from '@faker-js/faker/locale/en';
export function mockUsers(length) {
  const createRowData = rowIndex => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const gender = faker.person.sex();
    const name = faker.person.fullName({ firstName, lastName, sex: gender });
    const avatar = 'https://i.pravatar.cc/150?u=' + firstName;
    const birthdate = faker.date.birthdate();

    const city = faker.location.city();
    const street = faker.location.street();
    const email = faker.internet.email();
    const postcode = faker.location.zipCode();
    const phone = faker.phone.number();
    const amount = faker.finance.amount({ min: 1000, max: 90000 });
    const company = faker.company.name();

    const age = Math.floor(Math.random() * 30) + 18;
    const stars = Math.floor(Math.random() * 10000);
    const followers = Math.floor(Math.random() * 10000);
    const rating = 2 + Math.floor(Math.random() * 3);
    const progress = Math.floor(Math.random() * 100);

    return {
      id: rowIndex + 1,
      name,
      firstName,
      lastName,
      avatar,
      city,
      street,
      postcode,
      email,
      phone,
      gender,
      age,
      stars,
      followers,
      rating,
      progress,
      amount,
      company,
      birthdate
    };
  };

  return Array.from({ length }).map((_, index) => {
    return createRowData(index);
  });
}
