-- CreateTable
CREATE TABLE `alumni_businesses` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `nama_usaha` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `kategori` ENUM('Kuliner', 'Fashion', 'Teknologi', 'Pendidikan', 'Kesehatan', 'Properti', 'Otomotif', 'Jasa_Profesional', 'Retail', 'Kreatif_Media', 'Pertanian', 'Lainnya') NOT NULL,
    `no_kontak` VARCHAR(191) NULL,
    `link_website` VARCHAR(191) NULL,
    `link_instagram` VARCHAR(191) NULL,
    `foto_usaha_1` VARCHAR(191) NULL,
    `foto_usaha_2` VARCHAR(191) NULL,
    `foto_usaha_3` VARCHAR(191) NULL,
    `alamat` TEXT NULL,
    `cari_mitra` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('active', 'inactive', 'pending', 'rejected') NOT NULL DEFAULT 'pending',
    `rejection_reason` TEXT NULL,
    `views_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `alumni_businesses_user_id_idx`(`user_id`),
    INDEX `alumni_businesses_status_idx`(`status`),
    INDEX `alumni_businesses_kategori_idx`(`kategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni_skills` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `skill` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `format` ENUM('Workshop', 'Seminar', 'Webinar', 'Pelatihan', 'Mentoring') NOT NULL,
    `level` ENUM('Pemula', 'Menengah', 'Lanjut') NOT NULL DEFAULT 'Pemula',
    `durasi` VARCHAR(191) NULL,
    `ketersediaan` VARCHAR(191) NOT NULL DEFAULT 'online',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `alumni_skills_user_id_idx`(`user_id`),
    INDEX `alumni_skills_kategori_idx`(`kategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skill_requests` (
    `id` CHAR(36) NOT NULL,
    `requester_id` CHAR(36) NOT NULL,
    `skill_kategori` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `format` ENUM('Workshop', 'Seminar', 'Webinar', 'Pelatihan', 'Mentoring') NULL,
    `is_fulfilled` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `skill_requests_requester_id_idx`(`requester_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alumni_businesses` ADD CONSTRAINT `alumni_businesses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `alumni_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_skills` ADD CONSTRAINT `alumni_skills_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `alumni_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skill_requests` ADD CONSTRAINT `skill_requests_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `alumni_profiles`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
