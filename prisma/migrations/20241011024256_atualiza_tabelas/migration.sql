/*
  Warnings:

  - Added the required column `ativo` to the `Estacionamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ativo` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Estacionamento" ADD COLUMN     "ativo" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "ativo" BOOLEAN NOT NULL;
