/*
  Warnings:

  - You are about to drop the column `valor_pago` on the `EntradaSaida` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EntradaSaida" DROP COLUMN "valor_pago",
ADD COLUMN     "valor_a_pagar" DOUBLE PRECISION;
