import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { env } from '../env';
import { userRepository } from '../repositories/user.repository';
import { ErroDeAplicacao } from './erro-de-aplicacao';

const CUSTO_HASH_SENHA = 10;
const EXPIRACAO_TOKEN = '7d';

export class EmailJaCadastradoError extends ErroDeAplicacao {
  readonly statusCode = 409;

  constructor(email: string) {
    super(`Já existe um usuário cadastrado com o email ${email}`);
  }
}

export class DadosCadastroInvalidosError extends ErroDeAplicacao {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
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
}

function validarDadosCadastro(input: CadastrarUsuarioInput): void {
  if (!input.nome.trim()) {
    throw new DadosCadastroInvalidosError('Nome é obrigatório');
  }
  if (!input.email.includes('@')) {
    throw new DadosCadastroInvalidosError('Email inválido');
  }
  if (!input.senha) {
    throw new DadosCadastroInvalidosError('Senha é obrigatória');
  }
}

export const userService: UserService = {
  async cadastrar(input) {
    validarDadosCadastro(input);

    const usuarioExistente = await userRepository.findByEmail(input.email);
    if (usuarioExistente) {
      throw new EmailJaCadastradoError(input.email);
    }

    const senhaHash = await bcrypt.hash(input.senha, CUSTO_HASH_SENHA);

    return userRepository.create({
      nome: input.nome,
      email: input.email,
      senhaHash,
    });
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
