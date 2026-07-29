import type { User } from '@prisma/client';
import type { z } from 'zod';
import type { cadastroSchema } from './user.service';

export type CadastrarUsuarioInput = z.infer<typeof cadastroSchema>;

export interface UsuarioAutenticado {
  usuario: User;
  token: string;
}

export interface UserService {
  cadastrar(input: unknown): Promise<UsuarioAutenticado>;
}
