import app from '../../src/app.js';
import { expect, use } from 'chai';
import chaiJsonSchema from 'chai-json-schema';
import { comTokenDoAdmin, loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { alunosFixture } from '../fixtures/alunos.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { enrollStudent, studentSendActivity } from '../helpers/disciplinas.js';

use(chaiJsonSchema);

describe('Registro de Atividades dos Alunos', () => {

  let authorization;

  beforeEach(async () => {
    authorization = await comTokenDoAdmin(app);
  });

  it('logar como administrador, cadastrar um aluno, logar como aluno e registrar a entrega de um trabalho como aluno', async () => {
    const aluno = novoAluno();
    const alunoResponse = await createStudent(aluno, authorization, app);
    const disciplina = "disciplina-programacao-web"
    const alunoTokenResponse = await loginUser(aluno.email, aluno.senha, app);
    await enrollStudent(disciplina, alunoResponse.body.id, authorization, app);
    const registroAtividadeResponse = await studentSendActivity(alunoResponse.body.id, alunoTokenResponse.body.token, disciplina, app);
    expect(registroAtividadeResponse.status).to.equal(201);
  })
})
