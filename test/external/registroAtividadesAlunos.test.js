import { expect, use } from 'chai';
import chaiJsonSchema from 'chai-json-schema';
import { comTokenDoAdmin, loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { enrollStudent, studentSendActivity } from '../helpers/disciplinas.js';
import { registroAtividadeSchema } from '../schemas/registroAtividadesSchema.js';
import { registroAtividadeCenarios } from '../fixtures/registrandoTrabalhoCenarios.js';

use(chaiJsonSchema);

describe('Registro de Atividades dos Alunos', () => {

  let authorization;
  let aluno;

  beforeEach(async () => {
    authorization = await comTokenDoAdmin();
    aluno = novoAluno();
  });

  it('logar como administrador, cadastrar um aluno, logar como aluno e registrar a entrega de um trabalho como aluno', async () => {
    const alunoResponse = await createStudent(aluno, authorization);
    const alunoTokenResponse = await loginUser(aluno.email, aluno.senha)
    const disciplina = "disciplina-programacao-web"
    await enrollStudent(disciplina, alunoResponse.body.id, authorization);
    const registroAtividadeResponse = await studentSendActivity(alunoResponse.body.id, alunoTokenResponse.body.token, disciplina);
    expect(registroAtividadeResponse.status).to.equal(201);
    expect(registroAtividadeResponse.body).to.be.jsonSchema(registroAtividadeSchema);
  })

  registroAtividadeCenarios.forEach((cenario) => {
    it(`Deve permitir que esses alunos entreguem o trabalho: ${cenario.titulo}`, async () => {
      const alunoTokenResponse = await loginUser(cenario.email, '123456');
      await enrollStudent(cenario.disciplina, cenario.id, authorization);
      const registroAtividadeResponse = await studentSendActivity(cenario.id, alunoTokenResponse.body.token, cenario.disciplina);
      expect(registroAtividadeResponse.status).to.equal(201);
      expect(registroAtividadeResponse.body).to.be.jsonSchema(registroAtividadeSchema);
    });
  });
})
