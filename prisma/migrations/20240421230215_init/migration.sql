/*
  Warnings:

  - You are about to drop the column `quantity_on_hand` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `name` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Medication` DROP FOREIGN KEY `Medication_medication_id_fkey`;

-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `medication_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Medication` DROP COLUMN `quantity_on_hand`;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_medication_id_fkey` FOREIGN KEY (`medication_id`) REFERENCES `Medication`(`medication_id`) ON DELETE SET NULL ON UPDATE CASCADE;
