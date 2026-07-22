import Fastify from 'fastify';
import { env } from './env';

async function main() {
  const app = Fastify({ logger: true });

  await app.listen({ port: env.port });
}

main();
