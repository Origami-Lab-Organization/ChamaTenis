import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma, type User } from '@prisma/client';
import { z } from 'zod';
import { env } from '../env';
import { userRepository } from '../repositories/user.repository';
import { ErroDeAplicacao } from './erro-de-aplicacao';
import type { CadastrarUsuarioInput, LoginInput, UserService } from './user.service.types';

const CUSTO_HASH_SENHA = 10;
const EXPIRACAO_TOKEN = '7d';
const CODIGO_CONSTRAINT_UNICA = 'P2002';
// Comparado quando o email não existe, pra não revelar por timing quais emails estão cadastrados.
const HASH_SEM_USUARIO_CORRESPONDENTE = '$2b$10$ZfF8r52JuijaOa4nXxRNbO4SCVsoiu.vZdaxp.2UtOxbLi37imWz2';

export class EmailJaCadastradoError extends ErroDeAplicacao {
  readonly statusCode = 409;

  constructor() {
    super('EMAIL_JA_CADASTRADO');
  }
}

export class DadosCadastroInvalidosError extends ErroDeAplicacao {
  readonly statusCode = 400;
}

export class DadosLoginInvalidosError extends ErroDeAplicacao {
  readonly statusCode = 400;
}

export class CredenciaisInvalidasError extends ErroDeAplicacao {
  readonly statusCode = 401;

  constructor() {
    super('CREDENCIAIS_INVALIDAS');
  }
}

export const cadastroSchema = z.object({
  nome: z.string().trim().min(1, 'nome: obrigatório'),
  email: z.string().min(1, 'email: obrigatório').email('email: formato inválido'),
  senha: z
    .string()
    .min(1, 'senha: obrigatório')
    .min(8, 'senha: mínimo 8 caracteres, com letra e número')
    .regex(/[A-Za-z]/, 'senha: mínimo 8 caracteres, com letra e número')
    .regex(/\d/, 'senha: mínimo 8 caracteres, com letra e número'),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'email: obrigatório'),
  senha: z.string().min(1, 'senha: obrigatório'),
});

function validarDadosCadastro(input: unknown): CadastrarUsuarioInput {
  const resultado = cadastroSchema.safeParse(input);
  if (!resultado.success) {
    const [primeiroErro] = resultado.error.issues;
    throw new DadosCadastroInvalidosError(primeiroErro?.message ?? 'dados de cadastro inválidos');
  }
  return resultado.data;
}

function validarDadosLogin(input: unknown): LoginInput {
  const resultado = loginSchema.safeParse(input);
  if (!resultado.success) {
    const [primeiroErro] = resultado.error.issues;
    throw new DadosLoginInvalidosError(primeiroErro?.message ?? 'dados de login inválidos');
  }
  return resultado.data;
}

function gerarToken(usuario: User): string {
  return jwt.sign({ id: usuario.id }, env.jwtSecret, { expiresIn: EXPIRACAO_TOKEN });
}

function ehViolacaoDeEmailDuplicado(erro: unknown): boolean {
  return erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === CODIGO_CONSTRAINT_UNICA;
}

async function criarUsuario(dados: CadastrarUsuarioInput): Promise<User> {
  const senhaHash = await bcrypt.hash(dados.senha, CUSTO_HASH_SENHA);

  try {
    return await userRepository.create({ nome: dados.nome, email: dados.email, senhaHash });
  } catch (erro) {
    if (ehViolacaoDeEmailDuplicado(erro)) {
      throw new EmailJaCadastradoError();
    }
    throw erro;
  }
}

export const userService: UserService = {
  async cadastrar(input) {
    const dados = validarDadosCadastro(input);

    const usuarioExistente = await userRepository.findByEmail(dados.email);
    if (usuarioExistente) {
      throw new EmailJaCadastradoError();
    }

    const usuario = await criarUsuario(dados);
    return { usuario, token: gerarToken(usuario) };
  },

  async login(input) {
    const dados = validarDadosLogin(input);

    const usuario = await userRepository.findByEmail(dados.email);
    const senhaValida = await bcrypt.compare(dados.senha, usuario?.senhaHash ?? HASH_SEM_USUARIO_CORRESPONDENTE);

    if (!usuario || !senhaValida) {
      throw new CredenciaisInvalidasError();
    }

    return {
      token: gerarToken(usuario),
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  },
};
