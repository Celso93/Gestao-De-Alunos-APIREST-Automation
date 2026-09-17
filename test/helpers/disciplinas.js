import { api } from './api.js'

export async function createDiscipline(disciplinaObject, authorization, app) {
    return await api(app)
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send(disciplinaObject)
}

export async function enrollStudent(disciplinaId, alunoId, authorization, app) {
    return await api(app)
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send({ alunoId })
}

export async function studentSendActivity(alunoId, studentAuthorization, disciplinaId, app) {
    return await api(app)
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${studentAuthorization}`)
      .send({
            disciplinaId: disciplinaId,
            titulo: "Atividade final do modulo de automação de testes",
            descricao: "Registro do aluno"
        });
}