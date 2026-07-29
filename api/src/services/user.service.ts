import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { Prisma, type User } from '@prisma/client';
import { z } from 'zod';
import { env } from '../env';
import { userRepository } from '../repositories/user.repository';
import { ErroDeAplicacao } from './erro-de-aplicacao';
import type { CadastrarUsuarioInput, UserService } from './user.service.types';

const CUSTO_HASH_SENHA = 10;
const EXPIRACAO_TOKEN = '7d';
const CODIGO_CONSTRAINT_UNICA = 'P2002';

export class EmailJaCadastradoError extends ErroDeAplicacao {
  readonly statusCode = 409;

  constructor() {
    super('EMAIL_JA_CADASTRADO');
  }
}

export class DadosCadastroInvalidosError extends ErroDeAplicacao {
  readonly statusCode = 400;
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

function validarDadosCadastro(input: unknown): CadastrarUsuarioInput {
  const resultado = cadastroSchema.safeParse(input);
  if (!resultado.success) {
    const [primeiroErro] = resultado.error.issues;
    throw new DadosCadastroInvalidosError(primeiroErro?.message ?? 'dados de cadastro inválidos');
  }
  return resultado.data;
}

export class CredenciaisInvalidasError extends ErroDeAplicacao {
  readonly statusCode = 401;

  constructor() {
    super('Email ou senha inválidos');
  }
}

export interface CadastrarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface LoginResultado {
  token: string;
  usuario: Pick<User, 'id' | 'nome' | 'email'>;
}

export interface UserService {
  cadastrar(input: CadastrarUsuarioInput): Promise<User>;
  login(input: LoginInput): Promise<LoginResultado>;
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
    const usuario = await userRepository.findByEmail(input.email);
    if (!usuario) {
      throw new CredenciaisInvalidasError();
    }

    const senhaValida = await bcrypt.compare(input.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new CredenciaisInvalidasError();
    }

    const token = jwt.sign({ id: usuario.id }, env.jwtSecret, { expiresIn: EXPIRACAO_TOKEN });

    return {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  },
};
