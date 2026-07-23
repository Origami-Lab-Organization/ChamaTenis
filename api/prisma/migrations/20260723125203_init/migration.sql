-- CreateEnum
CREATE TYPE "StatusPartida" AS ENUM ('aguardando_oponente', 'marcada', 'jogada');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" TEXT NOT NULL,
    "criadorId" TEXT NOT NULL,
    "oponenteId" TEXT,
    "local" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" "StatusPartida" NOT NULL DEFAULT 'aguardando_oponente',
    "placar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
