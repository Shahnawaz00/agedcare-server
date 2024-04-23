/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Member` ADD COLUMN `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Staff` ADD COLUMN `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_email_key` ON `Admin`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Member_email_key` ON `Member`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Staff_email_key` ON `Staff`(`email`);
