import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '../services/user.service';

export async function cadastrarUsuario(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { usuario, token } = await userService.cadastrar(request.body);

  reply.status(201).send({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    token,
  });
}
