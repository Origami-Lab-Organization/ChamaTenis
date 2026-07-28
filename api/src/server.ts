import Fastify from 'fastify';
import { env } from './env';
import { registrarErrorHandler } from './middlewares/error-handler';
import { registrarRotasDeUsuario } from './routes/user.routes';

async function main() {
  const app = Fastify({ logger: true });

  registrarErrorHandler(app);
  await registrarRotasDeUsuario(app);

  await app.listen({ port: env.port });
}

main();
