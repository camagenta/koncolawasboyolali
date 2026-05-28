-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `google_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('super_admin', 'admin_unit', 'alumni') NOT NULL DEFAULT 'alumni',
    `avatar_url` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_google_id_key`(`google_id`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buku_induk_references` (
    `id` CHAR(36) NOT NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tahun_masuk` INTEGER NOT NULL,
    `jurusan` VARCHAR(191) NULL,
    `kelas_3` VARCHAR(191) NULL,
    `is_matched` BOOLEAN NOT NULL DEFAULT false,
    `matched_by` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `buku_induk_references_nis_key`(`nis`),
    UNIQUE INDEX `buku_induk_references_matched_by_key`(`matched_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni_profiles` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `buku_induk_id` CHAR(36) NULL,
    `nis` VARCHAR(191) NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NOT NULL,
    `tahun_masuk` INTEGER NOT NULL,
    `tahun_lulus` INTEGER NOT NULL,
    `jurusan` VARCHAR(191) NULL,
    `kelas_1` VARCHAR(191) NULL,
    `kelas_2` VARCHAR(191) NULL,
    `kelas_3` VARCHAR(191) NOT NULL,
    `kota_domisili` VARCHAR(191) NOT NULL,
    `kecamatan_asal_boyolali` VARCHAR(191) NOT NULL,
    `alamat_lengkap` VARCHAR(191) NULL,
    `foto_profil` VARCHAR(191) NULL,
    `link_linkedin` VARCHAR(191) NULL,
    `link_instagram` VARCHAR(191) NULL,
    `status_utama` ENUM('Bekerja', 'Kuliah', 'Wirausaha', 'Belum_Bekerja', 'Lainnya') NOT NULL DEFAULT 'Lainnya',
    `is_data_from_buku_induk` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `alumni_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education_histories` (
    `id` CHAR(36) NOT NULL,
    `alumni_profile_id` CHAR(36) NOT NULL,
    `jenjang` VARCHAR(191) NOT NULL,
    `institusi` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NULL,
    `tahun_masuk` INTEGER NULL,
    `tahun_lulus` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `career_histories` (
    `id` CHAR(36) NOT NULL,
    `alumni_profile_id` CHAR(36) NOT NULL,
    `perusahaan` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `sektor_industri` VARCHAR(191) NULL,
    `tahun_mulai` INTEGER NULL,
    `tahun_selesai` INTEGER NULL,
    `kota_penempatan` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_categories` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'public',
    `tahun_masuk_target` INTEGER NULL,
    `created_by` CHAR(36) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `forum_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_threads` (
    `id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_by` CHAR(36) NOT NULL,
    `is_pinned` BOOLEAN NOT NULL DEFAULT false,
    `is_locked` BOOLEAN NOT NULL DEFAULT false,
    `total_comments` INTEGER NOT NULL DEFAULT 0,
    `last_activity_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_comments` (
    `id` CHAR(36) NOT NULL,
    `thread_id` CHAR(36) NOT NULL,
    `parent_id` CHAR(36) NULL,
    `content` TEXT NOT NULL,
    `created_by` CHAR(36) NOT NULL,
    `total_likes` INTEGER NOT NULL DEFAULT 0,
    `is_hidden` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `forum_likes` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `thread_id` CHAR(36) NULL,
    `comment_id` CHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `forum_likes_user_id_thread_id_key`(`user_id`, `thread_id`),
    UNIQUE INDEX `forum_likes_user_id_comment_id_key`(`user_id`, `comment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discussion_groups` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'public',
    `group_image` VARCHAR(191) NULL,
    `created_by` CHAR(36) NOT NULL,
    `max_members` INTEGER NOT NULL DEFAULT 0,
    `last_activity_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_members` (
    `id` CHAR(36) NOT NULL,
    `group_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'member',
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `group_members_group_id_user_id_key`(`group_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` CHAR(36) NOT NULL,
    `sender_id` CHAR(36) NOT NULL,
    `receiver_id` CHAR(36) NULL,
    `group_id` CHAR(36) NULL,
    `message` TEXT NOT NULL,
    `message_type` VARCHAR(191) NOT NULL DEFAULT 'text',
    `file_url` VARCHAR(191) NULL,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_postings` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `kategori_bidang` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NULL,
    `tipe` ENUM('full_time', 'part_time', 'internship') NOT NULL,
    `link_external` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NULL,
    `deadline` DATE NULL,
    `posted_by` CHAR(36) NOT NULL,
    `approved_by` CHAR(36) NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `rejection_reason` TEXT NULL,
    `views_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_units` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `unit_name` VARCHAR(191) NOT NULL,
    `tahun_masuk_target` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_units_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `buku_induk_references` ADD CONSTRAINT `buku_induk_references_matched_by_fkey` FOREIGN KEY (`matched_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_profiles` ADD CONSTRAINT `alumni_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_profiles` ADD CONSTRAINT `alumni_profiles_buku_induk_id_fkey` FOREIGN KEY (`buku_induk_id`) REFERENCES `buku_induk_references`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `education_histories` ADD CONSTRAINT `education_histories_alumni_profile_id_fkey` FOREIGN KEY (`alumni_profile_id`) REFERENCES `alumni_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `career_histories` ADD CONSTRAINT `career_histories_alumni_profile_id_fkey` FOREIGN KEY (`alumni_profile_id`) REFERENCES `alumni_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_categories` ADD CONSTRAINT `forum_categories_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_threads` ADD CONSTRAINT `forum_threads_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `forum_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_threads` ADD CONSTRAINT `forum_threads_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_comments` ADD CONSTRAINT `forum_comments_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_comments` ADD CONSTRAINT `forum_comments_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `forum_comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_comments` ADD CONSTRAINT `forum_comments_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_likes` ADD CONSTRAINT `forum_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_likes` ADD CONSTRAINT `forum_likes_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `forum_likes` ADD CONSTRAINT `forum_likes_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `forum_comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `discussion_groups` ADD CONSTRAINT `discussion_groups_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_members` ADD CONSTRAINT `group_members_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `discussion_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_members` ADD CONSTRAINT `group_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `discussion_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_postings` ADD CONSTRAINT `job_postings_posted_by_fkey` FOREIGN KEY (`posted_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_postings` ADD CONSTRAINT `job_postings_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_units` ADD CONSTRAINT `admin_units_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
