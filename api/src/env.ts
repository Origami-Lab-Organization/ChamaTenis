function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(required('PORT')),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
};
