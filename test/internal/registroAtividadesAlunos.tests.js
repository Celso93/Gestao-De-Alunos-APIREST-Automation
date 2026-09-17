import app from '../../src/app.js';
import { expect } from 'chai';
import { comTokenDoAdmin, loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { api } from '../helpers/api.js';


describe('Registro de Atividades dos Alunos', () => {

  let authorization;

  beforeEach(async () => {
    authorization = await comTokenDoAdmin(app);
  });

  it('logar como administrador, cadastrar um aluno, logar como aluno e registrar a entrega de um trabalho como aluno', async () => {
    // Arrange
    const aluno = novoAluno();
    const alunoResponse = await createStudent(aluno, authorization, app);
    console.log('email:', aluno.email);
    console.log('email:', aluno.senha);
    const alunoTokenResponse = await loginUser(aluno.email, aluno.senha);
    // Act
    const registroAtividadeResponse = await api(app)
      .post(`/alunos/${alunoResponse.body.id}/trabalhos`)
      .set('Authorization', `Bearer ${alunoTokenResponse.body.token}`)
      .send({
            disciplinaId: "disciplina-programacao-web",
            titulo: "Atividade final do modulo de automação de testes",
            descricao: "Registro do aluno"
        });

    console.log('Aluno cadastrado:', aluno);
    console.log('alunoResponse.body:', alunoResponse.body);
    console.log('alunoTokenResponse.body:', alunoTokenResponse.body);
    console.log('registroAtividadeResponse.body:', registroAtividadeResponse.body);

    // Assert
    expect(registroAtividadeResponse.status).to.equal(201);
    // expect(alunoResponse.body).to.have.property('nome', aluno.nome);
    // expect(alunoResponse.body).to.have.property('role', 'aluno');
  })
})
