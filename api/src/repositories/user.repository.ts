import type { User } from '@prisma/client';
import { prisma } from './prisma';

export interface UserRepository {
  create(input: { nome: string; email: string; senhaHash: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export const userRepository: UserRepository = {
  create(input) {
    return prisma.user.create({ data: input });
  },
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
};
