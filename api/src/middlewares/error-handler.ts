import type { FastifyInstance } from 'fastify';
import { ErroDeAplicacao } from '../services/erro-de-aplicacao';

export function registrarErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ErroDeAplicacao) {
      reply.status(error.statusCode).send({ message: error.message });
      return;
    }

    request.log.error(error);
    reply.status(500).send({ message: 'Erro interno do servidor' });
  });
}
