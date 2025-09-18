CREATE DATABASE IF NOT EXISTS `pkumi`;

USE pkumi;

CREATE TABLE IF NOT EXISTS `enumeration_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `enumeration_type` VALUES (1,'USERS TYPE','UT',1,'2023-09-23 10:41:54',1,NULL,NULL),(2,'WS_LOG','WS',1,'2023-09-23 10:41:54',1,NULL,NULL),(3,'STUDY LEVEL','SL',1,'2023-11-05 15:38:54',1,NULL,NULL),(4,'REGISTRATION STATUS','RS',1,'2023-11-12 17:01:08',1,NULL,NULL);

CREATE TABLE IF NOT EXISTS `enumeration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `code` varchar(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `is_service` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `enumeration` VALUES (1,1,'Admin','User Type Admin','UT-001',1,'2023-09-23 00:00:00',1,NULL,NULL,0),(2,1,'Mahasiswa','User Type Mahasiswa','UT-002',1,'2023-09-23 00:00:00',1,NULL,NULL,0),(3,1,'Dosen','User Type Dosen','UT-003',1,'2023-09-23 00:00:00',1,NULL,NULL,0),(4,2,'Register','Service Register','WS-001',1,'2023-09-23 00:00:00',1,NULL,NULL,1),(5,2,'Login','Service Login','WS-002',1,'2023-09-23 00:00:00',1,NULL,NULL,1),(6,3,'S1','Sarjana','SL-004',1,'2023-11-05 00:00:00',1,NULL,NULL,0),(7,3,'S2','Magister','SL-005',1,'2023-11-05 00:00:00',1,NULL,NULL,0),(8,3,'S3','Doktor','SL-006',1,'2023-11-05 00:00:00',1,NULL,NULL,0),(9,4,'BARU','Baru mendaftar','RS-001',1,'2023-11-12 00:00:00',1,NULL,NULL,0),(10,4,'MENGAJUKAN_BERKAS','Mengajukan Berkas','RS-002',1,'2023-11-12 17:02:54',1,NULL,NULL,0),(11,4,'DISETUJUI_BERKAS','Berkas Disetujui','RS-003',1,'2023-11-12 17:03:17',1,NULL,NULL,0),(12,4,'DITOLAK_BERKAS','Berkas Ditolak','RS-004',1,'2023-11-12 17:03:46',1,NULL,NULL,0),(13,4,'DIAJUKAN_KEMBALI_BERKAS','Berkas Diajukan Kembali','RS-005',1,'2023-11-12 17:04:14',1,NULL,NULL,0),(14,4,'DIJADWALKAN_WAWANCARA','Dijadwalkan untuk wawancara','RS-006',1,'2023-11-12 17:04:43',1,NULL,NULL,0),(15,4,'HADIR_WAWANCARA','Hadir untuk wawancara','RS-007',1,'2023-11-12 17:05:09',1,NULL,NULL,0),(16,4,'TIDAK_HADIR_WAWANCARA','Tidak hadir pada saat wawancara','RS-008',1,'2023-11-12 17:05:37',1,NULL,NULL,0),(17,4,'TIDAK_LULUS_PENDAFTARAN','Tidak lulus pendaftaran','RS-009',1,'2023-11-12 17:06:05',1,NULL,NULL,0),(18,4,'MAHASISWA_AKTIF','Mahasiswa Aktif','RS-010',1,'2023-11-12 17:06:29',1,NULL,NULL,0),(19,3,'SD','Sekolah Dasar','SL-001',1,'2023-11-13 01:14:51',1,NULL,NULL,0),(20,3,'SMP','Sekolah Menengah Pertama','SL-002',1,'2023-11-13 01:14:51',1,NULL,NULL,0),(21,3,'SMA/SMK','Sekolah Menengah Atas','SL-003',1,'2023-11-13 01:14:51',1,NULL,NULL,0),(22,2,'Verifikasi Email','Service Verifikasi Email','WS-003',1,'2023-11-14 13:17:08',1,NULL,NULL,1),(23,2,'Update Profile','Service Update Profil User','WS-004',1,'2023-11-14 13:17:08',1,NULL,NULL,1),(24,2,'Update Status Notification','Service Update Read Notification','WS-005',1,'2023-11-14 13:17:08',1,NULL,NULL,1),(25,2,'Update Status Pemberkasan','Service Update Status Pemberkasan','WS-006',1,'2023-11-14 13:17:08',1,NULL,NULL,1),(26,2,'Update Status Wawancara','Service Update Status Wawancara','WS-007',1,'2023-11-14 13:17:08',1,NULL,NULL,1),(27,2,'Update Jadwal Wawancara','Service Update Jadwal Wawancara','WS-008',1,'2023-11-14 13:17:08',1,NULL,NULL,1),(28,2,'Update Formulir Pendaftaran','Service Update Formulir Pendaftaran','WS-009',1,'2023-11-25 17:00:45',1,NULL,NULL,1),(29,2,'Pengajuan Pendaftaran','Service Pengajuan Pendaftaran','WS-010',1,'2023-11-25 18:54:52',1,NULL,NULL,1);

CREATE TABLE IF NOT EXISTS `faculty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `desc` varchar(250) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `faculty` VALUES (1,'FK_PKU_S2','PKU S2','Fakultas Pendidikan Kader Ulama S2',1,0,'2023-11-25 00:00:00',1,NULL,NULL),(2,'FK_PKU_S3','PKU S3','Fakultas Pendidikan Kader Ulama S3',1,0,'2023-11-25 00:00:00',1,NULL,NULL);

CREATE TABLE IF NOT EXISTS `study_program` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int NOT NULL,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL,
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_study_program_faculty_idx` (`faculty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `study_program` VALUES (1,1,'SP_01','S2 PKU',0,'2023-11-25 00:00:00',1,NULL,NULL),(2,1,'SP_02','S2 PKUP',0,'2023-11-25 00:00:00',1,NULL,NULL),(3,2,'SP_03','S3 PKU',0,'2023-11-25 00:00:00',1,NULL,NULL);

CREATE TABLE IF NOT EXISTS `semester` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `value` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `verification_code` varchar(6) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `verification_code` (`verification_code`),
  KEY `type_id` (`type_id`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` VALUES (1,1,'admin@gmail.com','administrator','U2FsdGVkX1/elMdLVwfx7HDShchOU4NxuWGPA+pfqzw=',NULL,1,0,'2023-09-24 05:48:44',1,NULL,NULL);

CREATE TABLE IF NOT EXISTS `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `fullname` varchar(45) DEFAULT NULL,
  `birth_place` varchar(45) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `last_education` int DEFAULT NULL,
  `last_education_major` varchar(150) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `family_phone_number` varchar(20) DEFAULT NULL,
  `nim` varchar(40) DEFAULT NULL,
  `gender` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `registration_status` varchar(8) NOT NULL DEFAULT 'RS-001',
  `registration_notes` varchar(100) DEFAULT NULL,
  `status` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'Registrasi',
  `graduate_date` date DEFAULT NULL,
  `first_study` varchar(45) DEFAULT NULL,
  `study_level_id` int DEFAULT NULL,
  `faculty_id` int DEFAULT NULL,
  `study_program_id` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_student_users_idx` (`user_id`),
  KEY `fk_student_study_level_idx` (`study_level_id`),
  KEY `fk_last_education_idx` (`last_education`),
  KEY `fk_faculty_idx` (`faculty_id`),
  KEY `fk_study_program_idx` (`study_program_id`),
  KEY `fk_registration_status` (`registration_status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `certificate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `number` varchar(100) DEFAULT NULL,
  `file` mediumblob NOT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_certificate_student_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `semester_id` int NOT NULL,
  `study_program_id` int NOT NULL,
  `code` varchar(45) NOT NULL,
  `name` varchar(250) NOT NULL,
  `credits` int NOT NULL,
  `grade` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subject_semester_idx` (`semester_id`),
  KEY `fk_subject_study_program_idx` (`study_program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ktp_number` varchar(17) DEFAULT NULL,
  `ktp_filename` varchar(255) DEFAULT NULL,
  `ktp_file` mediumblob,
  `cv_filename` varchar(255) DEFAULT NULL,
  `cv_file` mediumblob,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_files` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user_notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `url` text,
  `title` varchar(100) DEFAULT NULL,
  `detail` text,
  `is_read` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_delete` tinyint(1) DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_notification_users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user_photo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `photo` blob NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_photo_users_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `web_pmb_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('Beranda','Download','FAQ','Contact') DEFAULT NULL,
  `title` text NOT NULL,
  `detail` text,
  `position` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `ws_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_name` varchar(50) NOT NULL,
  `request_json` text,
  `response_json` text,
  `time_submitted` datetime DEFAULT NULL,
  `time_response` datetime DEFAULT NULL,
  `status` varchar(14) NOT NULL,
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `lecturer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `fullname` varchar(45) NOT NULL,
  `birth_place` varchar(45) DEFAULT NULL,
  `birth_date` datetime DEFAULT NULL,
  `last_education` int DEFAULT NULL,
  `nidn` varchar(45) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `family_phone_number` varchar(20) DEFAULT NULL,
  `gender` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `created_by` int NOT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_lecturer_study_level_idx` (`last_education`),
  KEY `fk_lecturer_users_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;