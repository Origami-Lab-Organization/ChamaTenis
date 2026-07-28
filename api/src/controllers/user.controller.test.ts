import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registrarErrorHandler } from '../middlewares/error-handler';
import { DadosCadastroInvalidosError, EmailJaCadastradoError, userService } from '../services/user.service';
import { cadastrarUsuario } from './user.controller';

vi.mock('../services/user.service', async (importOriginal) => {
  const original = await importOriginal<typeof import('../services/user.service')>();
  return {
    ...original,
    userService: {
      cadastrar: vi.fn(),
    },
  };
});

function criarAppDeTeste() {
  const app = Fastify();
  registrarErrorHandler(app);
  app.post('/cadastro', cadastrarUsuario);
  return app;
}

describe('cadastrarUsuario (controller)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 201 com os dados do usuário criado, sem o hash da senha', async () => {
    vi.mocked(userService.cadastrar).mockResolvedValue({
      id: 'usuario-1',
      nome: 'Lucas',
      email: 'lucas@teste.dev',
      senhaHash: 'hash-nao-deveria-aparecer',
      createdAt: new Date(),
    });

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/cadastro',
      payload: { nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(201);
    const corpo = response.json();
    expect(corpo).toEqual({ id: 'usuario-1', nome: 'Lucas', email: 'lucas@teste.dev' });
    expect(corpo.senhaHash).toBeUndefined();
  });

  it('retorna 409 quando o Service lança EmailJaCadastradoError', async () => {
    vi.mocked(userService.cadastrar).mockRejectedValue(new EmailJaCadastradoError('lucas@teste.dev'));

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/cadastro',
      payload: { nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(409);
  });

  it('retorna 400 quando o Service lança DadosCadastroInvalidosError', async () => {
    vi.mocked(userService.cadastrar).mockRejectedValue(new DadosCadastroInvalidosError('Nome é obrigatório'));

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/cadastro',
      payload: { nome: '', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(400);
  });
});
