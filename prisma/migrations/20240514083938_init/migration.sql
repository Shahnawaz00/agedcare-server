/*
  Warnings:

  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_staff_id_fkey`;

-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `supplierName` VARCHAR(191) NULL,
    MODIFY `last_restocked` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Schedule`;
