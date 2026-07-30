import type { User } from '@prisma/client';
import type { z } from 'zod';
import type { cadastroSchema, loginSchema } from './user.service';

export type CadastrarUsuarioInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface UsuarioAutenticado {
  usuario: User;
  token: string;
}

export interface LoginResultado {
  token: string;
  usuario: Pick<User, 'id' | 'nome' | 'email'>;
}

export interface UserService {
  cadastrar(input: unknown): Promise<UsuarioAutenticado>;
  login(input: unknown): Promise<LoginResultado>;
}
