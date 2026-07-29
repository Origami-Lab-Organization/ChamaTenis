import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registrarErrorHandler } from '../middlewares/error-handler';
import { userService } from '../services/user.service';
import { registrarRotasDeUsuario } from './user.routes';

vi.mock('../services/user.service', async (importOriginal) => {
  const original = await importOriginal<typeof import('../services/user.service')>();
  return {
    ...original,
    userService: {
      cadastrar: vi.fn(),
    },
  };
});

async function criarAppDeTeste() {
  const app = Fastify();
  registrarErrorHandler(app);
  await app.register(registrarRotasDeUsuario, { prefix: '/api/auth' });
  return app;
}

describe('registrarRotasDeUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('expõe o cadastro em POST /api/auth/cadastro, sob o prefixo de domínio', async () => {
    vi.mocked(userService.cadastrar).mockResolvedValue({
      usuario: { id: '1', nome: 'Lucas', email: 'lucas@teste.dev', senhaHash: 'hash', createdAt: new Date() },
      token: 'jwt-fake-token',
    });

    const app = await criarAppDeTeste();
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/cadastro',
      payload: { nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(201);
  });

  it('não expõe a rota sem o prefixo de domínio', async () => {
    const app = await criarAppDeTeste();

    const response = await app.inject({ method: 'POST', url: '/cadastro', payload: {} });

    expect(response.statusCode).toBe(404);
  });
});
