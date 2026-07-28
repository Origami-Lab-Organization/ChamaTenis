import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { ErroDeAplicacao } from './erro-de-aplicacao';

const CUSTO_HASH_SENHA = 10;

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

export interface CadastrarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
}

export interface UserService {
  cadastrar(input: CadastrarUsuarioInput): Promise<User>;
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
};
