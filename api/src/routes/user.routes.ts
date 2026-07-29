import type { FastifyInstance } from 'fastify';
import { cadastrarUsuario } from '../controllers/user.controller';

export async function registrarRotasDeUsuario(app: FastifyInstance): Promise<void> {
  app.post('/cadastro', cadastrarUsuario);
}
