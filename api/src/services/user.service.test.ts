import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '../env';
import { userRepository } from '../repositories/user.repository';
import {
  CredenciaisInvalidasError,
  DadosCadastroInvalidosError,
  EmailJaCadastradoError,
  userService,
} from './user.service';

vi.mock('../repositories/user.repository', () => ({
  userRepository: {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findById: vi.fn(),
  },
}));

describe('userService.cadastrar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('faz hash da senha e persiste via userRepository.create', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockImplementation(async (input) => ({
      id: 'usuario-1',
      createdAt: new Date(),
      ...input,
    }));

    const usuario = await userService.cadastrar({
      nome: 'Lucas',
      email: 'lucas@teste.dev',
      senha: 'senha123',
    });

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    const dadosPersistidos = vi.mocked(userRepository.create).mock.calls[0]?.[0];
    expect(dadosPersistidos).toBeDefined();
    expect(dadosPersistidos?.senhaHash).not.toBe('senha123');
    expect(await bcrypt.compare('senha123', dadosPersistidos!.senhaHash)).toBe(true);
    expect(usuario.id).toBe('usuario-1');
  });

  it('lança EmailJaCadastradoError quando o email já existe', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'usuario-existente',
      nome: 'Outro',
      email: 'lucas@teste.dev',
      senhaHash: 'hash-qualquer',
      createdAt: new Date(),
    });

    await expect(
      userService.cadastrar({ nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' }),
    ).rejects.toThrow(EmailJaCadastradoError);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('lança DadosCadastroInvalidosError quando nome está vazio', async () => {
    await expect(
      userService.cadastrar({ nome: '   ', email: 'lucas@teste.dev', senha: 'senha123' }),
    ).rejects.toThrow(DadosCadastroInvalidosError);
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('lança DadosCadastroInvalidosError quando email não tem @', async () => {
    await expect(
      userService.cadastrar({ nome: 'Lucas', email: 'email-invalido', senha: 'senha123' }),
    ).rejects.toThrow(DadosCadastroInvalidosError);
  });

  it('lança DadosCadastroInvalidosError quando senha está vazia', async () => {
    await expect(
      userService.cadastrar({ nome: 'Lucas', email: 'lucas@teste.dev', senha: '' }),
    ).rejects.toThrow(DadosCadastroInvalidosError);
  });
});

describe('userService.login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna token válido e dados do usuário quando as credenciais batem', async () => {
    const senhaHash = await bcrypt.hash('senha123', 10);
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'usuario-1',
      nome: 'Lucas',
      email: 'lucas@teste.dev',
      senhaHash,
      createdAt: new Date(),
    });

    const resultado = await userService.login({ email: 'lucas@teste.dev', senha: 'senha123' });

    expect(resultado.usuario).toEqual({ id: 'usuario-1', nome: 'Lucas', email: 'lucas@teste.dev' });
    const payload = jwt.verify(resultado.token, env.jwtSecret);
    expect(payload).toMatchObject({ id: 'usuario-1' });
  });

  it('lança CredenciaisInvalidasError quando o email não existe', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      userService.login({ email: 'inexistente@teste.dev', senha: 'senha123' }),
    ).rejects.toThrow(CredenciaisInvalidasError);
  });

  it('lança CredenciaisInvalidasError quando a senha está errada', async () => {
    const senhaHash = await bcrypt.hash('senha-correta', 10);
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'usuario-1',
      nome: 'Lucas',
      email: 'lucas@teste.dev',
      senhaHash,
      createdAt: new Date(),
    });

    await expect(
      userService.login({ email: 'lucas@teste.dev', senha: 'senha-errada' }),
    ).rejects.toThrow(CredenciaisInvalidasError);
  });
});
