/*
  Warnings:

  - You are about to drop the column `nome` on the `Cargo` table. All the data in the column will be lost.
  - Added the required column `descricao` to the `Cargo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cargo" DROP COLUMN "nome",
ADD COLUMN     "descricao" TEXT NOT NULL;
