/*
  Warnings:

  - You are about to drop the column `rating` on the `song_versions` table. All the data in the column will be lost.
  - Added the required column `classification` to the `song_versions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "song_versions" DROP COLUMN "rating",
ADD COLUMN     "classification" TEXT NOT NULL;
