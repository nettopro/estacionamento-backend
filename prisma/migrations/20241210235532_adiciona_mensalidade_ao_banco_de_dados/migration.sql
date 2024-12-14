-- AlterTable
ALTER TABLE "Estacionamento" ADD COLUMN     "valor_mensalidade" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Mensalidade" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "estacionamentoId" INTEGER NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pago" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mensalidade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mensalidade" ADD CONSTRAINT "Mensalidade_estacionamentoId_fkey" FOREIGN KEY ("estacionamentoId") REFERENCES "Estacionamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
