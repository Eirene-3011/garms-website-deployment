-- ============================================================
-- GARMS Official Website — MySQL Schema
-- General Artemio Ricarte Memorial School (School ID: 107960)
-- ============================================================

CREATE DATABASE IF NOT EXISTS garms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE garms_db;

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255),
  role ENUM('admin','super_admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Single-row school settings
-- NOTE: TEXT columns cannot carry a DEFAULT in MySQL/TiDB, so those defaults
-- are inserted as an actual seed row below instead of as column defaults.
CREATE TABLE IF NOT EXISTS school_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_name VARCHAR(255) NOT NULL DEFAULT 'General Artemio Ricarte Memorial School',
  school_id_no VARCHAR(50) DEFAULT '107960',
  school_type VARCHAR(100) DEFAULT 'Public Elementary',
  address TEXT,
  region VARCHAR(100) DEFAULT 'Region IV-A',
  province VARCHAR(100) DEFAULT 'Cavite',
  city VARCHAR(100) DEFAULT 'General Trias City',
  district_division VARCHAR(150) DEFAULT 'Division of General Trias City',
  year_established VARCHAR(20) DEFAULT '1894',
  principal_name VARCHAR(255) DEFAULT 'Mar T. Sta. Maria',
  principal_title VARCHAR(150) DEFAULT 'School Principal I',
  motto TEXT,
  landline VARCHAR(50) DEFAULT '(046) 472-5307',
  mobile VARCHAR(50) DEFAULT '',
  email VARCHAR(255) DEFAULT '107960@deped.gov.ph',
  domain VARCHAR(255) DEFAULT 'garms107960.edu.ph',
  office_hours VARCHAR(255) DEFAULT 'Monday–Friday, 8:00 AM – 5:00 PM',
  google_maps_link TEXT,
  facebook_url TEXT,
  youtube_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  logo_url VARCHAR(500) DEFAULT '/uploads/logo.png',
  principal_photo_url VARCHAR(500) DEFAULT '/uploads/principal.jpg',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO school_info (
  address, motto, google_maps_link, facebook_url, youtube_url, instagram_url, tiktok_url
)
SELECT
  'Brgy. Bagumbayan, General Trias City, Cavite',
  'Empowering Artemians with Quality, Excellence, Service, and Resilience',
  'https://maps.app.goo.gl/QBCD8vwwZJSNaMUE8',
  '', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM school_info);

-- Content blocks (Vision, Mission, History, Core Values, Goals, etc.)
CREATE TABLE IF NOT EXISTS content_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  body_richtext LONGTEXT,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_block (page_slug, section_key)
);

-- Homepage banner slider
CREATE TABLE IF NOT EXISTS banner_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School / building photos
CREATE TABLE IF NOT EXISTS school_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Org chart
CREATE TABLE IF NOT EXISTS org_chart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Officials
CREATE TABLE IF NOT EXISTS officials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  department_office VARCHAR(255),
  contact_no VARCHAR(100),
  photo_url VARCHAR(500),
  sort_order INT DEFAULT 0
);

-- Faculty & Staff Directory
CREATE TABLE IF NOT EXISTS staff_directory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  position_subject VARCHAR(255),
  section_name VARCHAR(100),
  department_grade_level VARCHAR(100),
  years_in_service INT DEFAULT 0,
  contact_no VARCHAR(100),
  photo_url VARCHAR(500),
  photo_match_status ENUM('matched','unmatched','pending_review') DEFAULT 'pending_review',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Committees
CREATE TABLE IF NOT EXISTS committees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  committee_name VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS committee_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  committee_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  contact_no VARCHAR(100),
  FOREIGN KEY (committee_id) REFERENCES committees(id) ON DELETE CASCADE
);

-- Academic Programs
CREATE TABLE IF NOT EXISTS academic_programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grade_levels_offered TEXT,
  special_programs TEXT,
  cocurricular_activities TEXT,
  notable_achievements TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO academic_programs (grade_levels_offered)
SELECT 'Kindergarten to Grade 6'
WHERE NOT EXISTS (SELECT 1 FROM academic_programs);

-- Admissions / Enrollment
CREATE TABLE IF NOT EXISTS enrollment_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule TEXT,
  requirements_richtext LONGTEXT,
  process_richtext LONGTEXT,
  fees_note TEXT,
  contact_person VARCHAR(255),
  contact_number VARCHAR(100),
  online_enrollment_link TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO enrollment_info (fees_note)
SELECT 'Free / Public School'
WHERE NOT EXISTS (SELECT 1 FROM enrollment_info);

-- Programs, Projects & Activities
CREATE TABLE IF NOT EXISTS ppas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_description TEXT,
  frequency VARCHAR(100),
  image_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students' Corner
CREATE TABLE IF NOT EXISTS student_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('commendation','featured_student','accomplishment') NOT NULL,
  student_name VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  date_posted DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Resources
CREATE TABLE IF NOT EXISTS learning_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('ARAL','KS1','KS2','Supplementary') NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issuances (public-facing)
CREATE TABLE IF NOT EXISTS issuances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('memo','notice_of_meeting','procurement','form','deped_order') NOT NULL,
  title VARCHAR(500) NOT NULL,
  file_url VARCHAR(500),
  do_number VARCHAR(100),
  school_year VARCHAR(20),
  date_issued DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internal Forms & Memos (admin-only)
CREATE TABLE IF NOT EXISTS internal_forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  file_url VARCHAR(500),
  category ENUM('monitoring','planning','committee_memo','contingency_plan','other') DEFAULT 'other',
  uploaded_by VARCHAR(100),
  is_public TINYINT(1) DEFAULT 0,
  date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External DepEd reference links
CREATE TABLE IF NOT EXISTS external_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Citizen's Charter
CREATE TABLE IF NOT EXISTS citizens_charter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  body_richtext LONGTEXT,
  pdf_file_url VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- FAQ
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(1000) NOT NULL,
  answer_richtext LONGTEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School Calendar
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(500) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_recurring TINYINT(1) DEFAULT 0,
  category VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback / Survey links
CREATE TABLE IF NOT EXISTS feedback_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url TEXT,
  type ENUM('csm_survey','general_feedback','qr_code_image') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOSY Enrollment Statistics
CREATE TABLE IF NOT EXISTS enrollment_stats (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  school_year     VARCHAR(20) NOT NULL UNIQUE,   -- e.g. '2026-2027'
  sort_order      INT DEFAULT 0,                 -- higher = newer; used for ordering
  chart_image_url VARCHAR(500) DEFAULT NULL,      -- Cloudinary URL of official chart image
  kinder_male     INT NOT NULL DEFAULT 0,
  kinder_female   INT NOT NULL DEFAULT 0,
  grade1_male     INT NOT NULL DEFAULT 0,
  grade1_female   INT NOT NULL DEFAULT 0,
  grade2_male     INT NOT NULL DEFAULT 0,
  grade2_female   INT NOT NULL DEFAULT 0,
  grade3_male     INT NOT NULL DEFAULT 0,
  grade3_female   INT NOT NULL DEFAULT 0,
  grade4_male     INT NOT NULL DEFAULT 0,
  grade4_female   INT NOT NULL DEFAULT 0,
  grade5_male     INT NOT NULL DEFAULT 0,
  grade5_female   INT NOT NULL DEFAULT 0,
  grade6_male     INT NOT NULL DEFAULT 0,
  grade6_female   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read TINYINT(1) DEFAULT 0
);