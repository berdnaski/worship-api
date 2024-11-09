/*
  Warnings:

  - A unique constraint covering the columns `[userId,scheduleId,departmentId]` on the table `schedule_participants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "schedule_participants_userId_scheduleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "schedule_participants_userId_scheduleId_departmentId_key" ON "schedule_participants"("userId", "scheduleId", "departmentId");
