-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_facility_id_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_staff_id_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_medication_id_fkey`;

-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_staff_id_fkey`;

-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `category` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Member` ADD COLUMN `allergies` VARCHAR(191) NULL,
    ADD COLUMN `dietary_restrictions` VARCHAR(191) NULL,
    ADD COLUMN `emergency_phoneNo` VARCHAR(191) NULL,
    ADD COLUMN `medical_conditions` VARCHAR(191) NULL,
    ADD COLUMN `medicare_expiry_date` DATETIME(3) NULL,
    ADD COLUMN `medicare_irn` VARCHAR(191) NULL,
    ADD COLUMN `medicare_number` VARCHAR(191) NULL,
    ADD COLUMN `nok_email` VARCHAR(191) NULL,
    ADD COLUMN `nok_name` VARCHAR(191) NULL,
    ADD COLUMN `nok_phoneNo` VARCHAR(191) NULL,
    ADD COLUMN `nok_relationship` VARCHAR(191) NULL,
    ADD COLUMN `phoneNo` VARCHAR(191) NULL,
    MODIFY `emergency_contact` VARCHAR(191) NULL,
    MODIFY `next_of_kin` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Staff` ADD COLUMN `billing_address` VARCHAR(191) NULL,
    ADD COLUMN `date_of_birth` DATETIME(3) NULL,
    ADD COLUMN `emergency_contact` VARCHAR(191) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `lname` VARCHAR(191) NULL,
    ADD COLUMN `mailing_address` VARCHAR(191) NULL,
    ADD COLUMN `phoneNo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `Member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `Service`(`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_facility_id_fkey` FOREIGN KEY (`facility_id`) REFERENCES `Facility`(`facility_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_medication_id_fkey` FOREIGN KEY (`medication_id`) REFERENCES `Medication`(`medication_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;
