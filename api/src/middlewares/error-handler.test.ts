import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import { DadosCadastroInvalidosError, EmailJaCadastradoError } from '../services/user.service';
import { registrarErrorHandler } from './error-handler';

function criarAppDeTeste() {
  const app = Fastify();
  registrarErrorHandler(app);
  return app;
}

describe('registrarErrorHandler', () => {
  it('traduz EmailJaCadastradoError pro status 409', async () => {
    const app = criarAppDeTeste();
    app.get('/erro-conflito', () => {
      throw new EmailJaCadastradoError('lucas@teste.dev');
    });

    const response = await app.inject({ method: 'GET', url: '/erro-conflito' });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: 'Já existe um usuário cadastrado com o email lucas@teste.dev',
    });
  });

  it('traduz DadosCadastroInvalidosError pro status 400', async () => {
    const app = criarAppDeTeste();
    app.get('/erro-validacao', () => {
      throw new DadosCadastroInvalidosError('Nome é obrigatório');
    });

    const response = await app.inject({ method: 'GET', url: '/erro-validacao' });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ message: 'Nome é obrigatório' });
  });

  it('erro desconhecido cai em 500 sem vazar detalhe interno', async () => {
    const app = criarAppDeTeste();
    app.get('/erro-desconhecido', () => {
      throw new Error('detalhe interno sensível de implementação');
    });

    const response = await app.inject({ method: 'GET', url: '/erro-desconhecido' });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ message: 'Erro interno do servidor' });
  });
});
