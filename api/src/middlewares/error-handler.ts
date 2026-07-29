import type { FastifyInstance } from 'fastify';
import { ErroDeAplicacao } from '../services/erro-de-aplicacao';

export function registrarErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ErroDeAplicacao) {
      reply.status(error.statusCode).send({ error: error.message });
      return;
    }

    request.log.error(error);
    // harness-ok: este é o error handler central do Fastify (ADR-023) — é o único
    // lugar do projeto autorizado a montar a resposta HTTP de erro na mão.
    reply.status(500).send({ error: 'INTERNAL_ERROR' });
  });
}
