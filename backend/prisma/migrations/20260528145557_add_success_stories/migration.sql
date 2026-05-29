-- AlterTable: add new columns to alumni_profiles
ALTER TABLE `alumni_profiles` 
  ADD COLUMN `link_facebook` VARCHAR(191) NULL,
  ADD COLUMN `nama_panggilan` VARCHAR(191) NULL,
  ADD COLUMN `pekerjaan` VARCHAR(191) NULL,
  ADD COLUMN `is_private` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: success_stories
CREATE TABLE `success_stories` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `angkatan` INT NOT NULL,
    `photoUrl` VARCHAR(500) NULL,
    `achievement` VARCHAR(300) NOT NULL,
    `description` TEXT NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `userId` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
