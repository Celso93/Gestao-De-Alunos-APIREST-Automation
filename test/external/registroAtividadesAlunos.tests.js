import { expect, use } from 'chai';
import chaiJsonSchema from 'chai-json-schema';
import { comTokenDoAdmin, loginUser } from '../helpers/auth.js';
import { createStudent } from '../helpers/alunos.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { enrollStudent, studentSendActivity } from '../helpers/disciplinas.js';

use(chaiJsonSchema);

const registroAtividadeSchema = {
  title: 'Registro de Atividade Schema',
  type: 'object',
  required: [
    'id',
    'alunoId',
    'disciplinaId',
    'titulo',
    'descricao',
    'status',
    'nota',
    'feedback',
    'dataEntrega',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    alunoId: { type: 'string' },
    disciplinaId: { type: 'string' },
    titulo: { type: 'string' },
    descricao: { type: 'string' },
    status: { type: 'string' },
    nota: { type: ['number', 'null'] },
    feedback: { type: ['string', 'null'] },
    dataEntrega: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};

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
})
