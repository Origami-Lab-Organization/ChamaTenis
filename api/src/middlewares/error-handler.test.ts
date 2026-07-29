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
  it('traduz EmailJaCadastradoError pro status 409 com o código estável', async () => {
    const app = criarAppDeTeste();
    app.get('/erro-conflito', () => {
      throw new EmailJaCadastradoError();
    });

    const response = await app.inject({ method: 'GET', url: '/erro-conflito' });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({ error: 'EMAIL_JA_CADASTRADO' });
  });

  it('traduz DadosCadastroInvalidosError pro status 400', async () => {
    const app = criarAppDeTeste();
    app.get('/erro-validacao', () => {
      throw new DadosCadastroInvalidosError('nome: obrigatório');
    });

    const response = await app.inject({ method: 'GET', url: '/erro-validacao' });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'nome: obrigatório' });
  });

  it('erro desconhecido cai em 500 sem vazar detalhe interno', async () => {
    const app = criarAppDeTeste();
    app.get('/erro-desconhecido', () => {
      throw new Error('detalhe interno sensível de implementação');
    });

    const response = await app.inject({ method: 'GET', url: '/erro-desconhecido' });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({ error: 'INTERNAL_ERROR' });
  });
});
