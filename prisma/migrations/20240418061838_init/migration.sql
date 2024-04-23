-- AlterTable
ALTER TABLE `Appointment` MODIFY `appointment_date` DATETIME(3) NULL,
    MODIFY `appointment_time` VARCHAR(191) NULL,
    MODIFY `notes` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Facility` MODIFY `reservation_length` VARCHAR(191) NULL,
    MODIFY `date_reserved` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Member` ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `allergies_or_diet` VARCHAR(191) NULL,
    MODIFY `current_medications` VARCHAR(191) NULL,
    MODIFY `general_practitioner` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Staff` ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `qualifications` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NULL,
    MODIFY `availability` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Admin` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
