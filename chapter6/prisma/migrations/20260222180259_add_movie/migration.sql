/*
  Warnings:

  - You are about to drop the column `movieID` on the `watchlistItem` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `watchlistItem` table without a default value. This is not possible if the table is not empty.

*/

-- RenameColumn
ALTER TABLE "watchlistItem" RENAME COLUMN "movieID" TO "movieId";

-- DropForeignKey
ALTER TABLE "watchlistItem" DROP CONSTRAINT "watchlistItem_movieID_fkey";

-- AddForeignKey
ALTER TABLE "watchlistItem" ADD CONSTRAINT "watchlistItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
