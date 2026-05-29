-- AlterTable: make google_id nullable on users
ALTER TABLE `users` MODIFY `google_id` VARCHAR(191) NULL;
