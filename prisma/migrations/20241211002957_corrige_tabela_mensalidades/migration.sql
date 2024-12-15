/*
  Warnings:

  - You are about to drop the column `pago` on the `Mensalidade` table. All the data in the column will be lost.
  - Added the required column `valor_pago` to the `Mensalidade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mensalidade" DROP COLUMN "pago",
ADD COLUMN     "valor_pago" DOUBLE PRECISION NOT NULL;
