import { randomUUID } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from './prisma';
import { userRepository } from './user.repository';

const idsCriados: string[] = [];

afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: idsCriados } } });
  idsCriados.length = 0;
});

function emailDeTeste(): string {
  return `teste-${randomUUID()}@chamatenis.dev`;
}

async function criarUsuario(overrides: Partial<{ nome: string; email: string; senhaHash: string }> = {}) {
  const usuario = await userRepository.create({
    nome: 'Usuário de Teste',
    email: emailDeTeste(),
    senhaHash: 'hash-fake',
    ...overrides,
  });
  idsCriados.push(usuario.id);
  return usuario;
}

describe('userRepository', () => {
  it('create persiste o usuário e retorna o registro com id gerado', async () => {
    const usuario = await criarUsuario({ nome: 'Lucas' });

    expect(usuario.id).toBeTypeOf('string');
    expect(usuario.nome).toBe('Lucas');

    const persistido = await prisma.user.findUnique({ where: { id: usuario.id } });
    expect(persistido).not.toBeNull();
  });

  it('findByEmail retorna o usuário quando existe', async () => {
    const criado = await criarUsuario();

    const encontrado = await userRepository.findByEmail(criado.email);

    expect(encontrado?.id).toBe(criado.id);
  });

  it('findByEmail retorna null quando não existe', async () => {
    const encontrado = await userRepository.findByEmail(emailDeTeste());

    expect(encontrado).toBeNull();
  });

  it('findById retorna o usuário quando existe', async () => {
    const criado = await criarUsuario();

    const encontrado = await userRepository.findById(criado.id);

    expect(encontrado?.email).toBe(criado.email);
  });

  it('findById retorna null quando não existe', async () => {
    const encontrado = await userRepository.findById(randomUUID());

    expect(encontrado).toBeNull();
  });

  it('create com email duplicado propaga o erro de constraint única do Postgres', async () => {
    const criado = await criarUsuario();

    await expect(
      userRepository.create({ nome: 'Outro Nome', email: criado.email, senhaHash: 'hash-fake' }),
    ).rejects.toThrow();
  });
});
