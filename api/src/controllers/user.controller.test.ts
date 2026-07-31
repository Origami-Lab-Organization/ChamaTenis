import Fastify from 'fastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registrarErrorHandler } from '../middlewares/error-handler';
import {
  CredenciaisInvalidasError,
  DadosCadastroInvalidosError,
  EmailJaCadastradoError,
  userService,
} from '../services/user.service';
import { cadastrarUsuario, login } from './user.controller';

vi.mock('../services/user.service', async (importOriginal) => {
  const original = await importOriginal<typeof import('../services/user.service')>();
  return {
    ...original,
    userService: {
      cadastrar: vi.fn(),
      login: vi.fn(),
    },
  };
});

function criarAppDeTeste() {
  const app = Fastify();
  registrarErrorHandler(app);
  app.post('/cadastro', cadastrarUsuario);
  app.post('/login', login);
  return app;
}

describe('cadastrarUsuario (controller)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 201 com o usuário criado e o token, sem o hash da senha', async () => {
    vi.mocked(userService.cadastrar).mockResolvedValue({
      usuario: {
        id: 'usuario-1',
        nome: 'Lucas',
        email: 'lucas@teste.dev',
        senhaHash: 'hash-nao-deveria-aparecer',
        createdAt: new Date(),
      },
      token: 'jwt-fake-token',
    });

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/cadastro',
      payload: { nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      usuario: { id: 'usuario-1', nome: 'Lucas', email: 'lucas@teste.dev' },
      token: 'jwt-fake-token',
    });
  });

  it('retorna 409 com o código estável quando o Service lança EmailJaCadastradoError', async () => {
    vi.mocked(userService.cadastrar).mockRejectedValue(new EmailJaCadastradoError());

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/cadastro',
      payload: { nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({ error: 'EMAIL_JA_CADASTRADO' });
  });

  it('retorna 400 quando o Service lança DadosCadastroInvalidosError', async () => {
    vi.mocked(userService.cadastrar).mockRejectedValue(new DadosCadastroInvalidosError('nome: obrigatório'));

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/cadastro',
      payload: { nome: '', email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'nome: obrigatório' });
  });
});

describe('login (controller)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna 200 com token e dados do usuário quando o login dá certo', async () => {
    vi.mocked(userService.login).mockResolvedValue({
      token: 'token-fake',
      usuario: { id: 'usuario-1', nome: 'Lucas', email: 'lucas@teste.dev' },
    });

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'lucas@teste.dev', senha: 'senha123' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      token: 'token-fake',
      usuario: { id: 'usuario-1', nome: 'Lucas', email: 'lucas@teste.dev' },
    });
  });

  it('retorna 401 com o código estável quando o Service lança CredenciaisInvalidasError', async () => {
    vi.mocked(userService.login).mockRejectedValue(new CredenciaisInvalidasError());

    const response = await criarAppDeTeste().inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'lucas@teste.dev', senha: 'senha-errada' },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: 'CREDENCIAIS_INVALIDAS' });
  });
});
