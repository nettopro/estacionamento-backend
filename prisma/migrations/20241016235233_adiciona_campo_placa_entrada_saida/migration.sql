/*
  Warnings:

  - Added the required column `placa` to the `EntradaSaida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntradaSaida" ADD COLUMN     "placa" TEXT NOT NULL,
ALTER COLUMN "pago" SET DEFAULT false;
