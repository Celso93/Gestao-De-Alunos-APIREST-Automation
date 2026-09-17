import { faker } from '@faker-js/faker';

export function novoAluno() {
    const timestamp = Date.now();

    return {
        nome: faker.person.fullName(),
        email: `${faker.internet.username().toLowerCase()}${timestamp}@example.com`,
        matricula: `${timestamp}`,
        senha: 'senha1234',
    };
}
