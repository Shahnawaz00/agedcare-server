/*
  Warnings:

  - You are about to drop the column `supplierName` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `supplierName`,
    ADD COLUMN `supplier_name` VARCHAR(191) NULL;
