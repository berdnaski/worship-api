-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "scheduleId" TEXT;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
