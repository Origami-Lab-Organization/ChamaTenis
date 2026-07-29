import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CadastrarUsuarioInput, LoginInput } from '../services/user.service';
import { userService } from '../services/user.service';

export async function cadastrarUsuario(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { usuario, token } = await userService.cadastrar(request.body);

  reply.status(201).send({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    token,
  });
}

export async function login(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
): Promise<void> {
  const resultado = await userService.login(request.body);

  reply.status(200).send(resultado);
}
