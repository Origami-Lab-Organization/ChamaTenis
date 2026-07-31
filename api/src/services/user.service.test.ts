import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '../env';
import { userRepository } from '../repositories/user.repository';
import {
  CredenciaisInvalidasError,
  DadosLoginInvalidosError,
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

const dadosValidos = { nome: 'Lucas', email: 'lucas@teste.dev', senha: 'senha123' };

describe('userService.cadastrar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('faz hash da senha, persiste via userRepository.create e devolve usuário + token JWT', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockImplementation(async (input) => ({
      id: 'usuario-1',
      createdAt: new Date(),
      ...input,
    }));

    const resultado = await userService.cadastrar(dadosValidos);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    const dadosPersistidos = vi.mocked(userRepository.create).mock.calls[0]?.[0];
    expect(dadosPersistidos?.senhaHash).not.toBe(dadosValidos.senha);
    expect(await bcrypt.compare(dadosValidos.senha, dadosPersistidos!.senhaHash)).toBe(true);

    expect(resultado.usuario.id).toBe('usuario-1');
    const payload = jwt.verify(resultado.token, env.jwtSecret) as { id: string };
    expect(payload.id).toBe('usuario-1');
  });

  it('lança EmailJaCadastradoError com código estável quando o email já existe', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'usuario-existente',
      nome: 'Outro',
      email: dadosValidos.email,
      senhaHash: 'hash-qualquer',
      createdAt: new Date(),
    });

    await expect(userService.cadastrar(dadosValidos)).rejects.toThrow(EmailJaCadastradoError);
    await expect(userService.cadastrar(dadosValidos)).rejects.toMatchObject({ message: 'EMAIL_JA_CADASTRADO' });
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('traduz violação de constraint única do Postgres (corrida de cadastro simultâneo) em EmailJaCadastradoError', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`email`)', {
        code: 'P2002',
        clientVersion: '5.22.0',
      }),
    );

    await expect(userService.cadastrar(dadosValidos)).rejects.toThrow(EmailJaCadastradoError);
  });

  it('propaga erro de banco que não é violação de constraint única', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    const erroDeConexao = new Error('conexão com o banco perdida');
    vi.mocked(userRepository.create).mockRejectedValue(erroDeConexao);

    await expect(userService.cadastrar(dadosValidos)).rejects.toBe(erroDeConexao);
  });

  it('lança DadosCadastroInvalidosError quando nome está vazio', async () => {
    await expect(
      userService.cadastrar({ ...dadosValidos, nome: '   ' }),
    ).rejects.toMatchObject({ message: 'nome: obrigatório' });
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('lança DadosCadastroInvalidosError quando email está ausente', async () => {
    await expect(
      userService.cadastrar({ ...dadosValidos, email: '' }),
    ).rejects.toMatchObject({ message: 'email: obrigatório' });
  });

  it('lança DadosCadastroInvalidosError quando email não tem formato válido', async () => {
    await expect(
      userService.cadastrar({ ...dadosValidos, email: 'email-sem-arroba-nem-dominio' }),
    ).rejects.toMatchObject({ message: 'email: formato inválido' });
  });

  it('lança DadosCadastroInvalidosError quando senha está vazia', async () => {
    await expect(
      userService.cadastrar({ ...dadosValidos, senha: '' }),
    ).rejects.toMatchObject({ message: 'senha: obrigatório' });
  });

  it.each(['curta1', 'semnumeroaqui', '12345678'])(
    'lança DadosCadastroInvalidosError quando senha "%s" não atende a regra mínima',
    async (senhaFraca) => {
      await expect(
        userService.cadastrar({ ...dadosValidos, senha: senhaFraca }),
      ).rejects.toMatchObject({ message: 'senha: mínimo 8 caracteres, com letra e número' });
    },
  );
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

  it('lança CredenciaisInvalidasError com código estável quando o email não existe', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      userService.login({ email: 'inexistente@teste.dev', senha: 'senha123' }),
    ).rejects.toThrow(CredenciaisInvalidasError);
    await expect(
      userService.login({ email: 'inexistente@teste.dev', senha: 'senha123' }),
    ).rejects.toMatchObject({ message: 'CREDENCIAIS_INVALIDAS' });
  });

  it('compara a senha com um hash mesmo quando o email não existe, pra não vazar por timing', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    const compareSpy = vi.spyOn(bcrypt, 'compare');

    await expect(userService.login({ email: 'inexistente@teste.dev', senha: 'senha123' })).rejects.toThrow(
      CredenciaisInvalidasError,
    );

    expect(compareSpy).toHaveBeenCalledWith('senha123', expect.any(String));
  });

  it('lança CredenciaisInvalidasError com código estável quando a senha está errada', async () => {
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
    await expect(
      userService.login({ email: 'lucas@teste.dev', senha: 'senha-errada' }),
    ).rejects.toMatchObject({ message: 'CREDENCIAIS_INVALIDAS' });
  });

  it('lança DadosLoginInvalidosError quando o email está ausente', async () => {
    await expect(
      userService.login({ email: '', senha: 'senha123' }),
    ).rejects.toMatchObject({ message: 'email: obrigatório' });
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('lança DadosLoginInvalidosError quando a senha está ausente', async () => {
    await expect(
      userService.login({ email: 'lucas@teste.dev', senha: '' }),
    ).rejects.toMatchObject({ message: 'senha: obrigatório' });
  });

  it('lança DadosLoginInvalidosError quando o corpo da requisição não tem os campos esperados', async () => {
    await expect(userService.login({})).rejects.toThrow(DadosLoginInvalidosError);
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });
});
