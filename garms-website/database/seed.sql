

-- Admin user (magic link only — no password)
INSERT IGNORE INTO admin_users (username, email, role) VALUES ('admin', '107960@deped.gov.ph', 'super_admin');

-- School Info
INSERT IGNORE INTO school_info (id, school_name, school_id_no, school_type, address, region, province, city,
  district_division, year_established, principal_name, principal_title, motto,
  landline, email, domain, office_hours, google_maps_link, logo_url, principal_photo_url)
VALUES (1,
  'General Artemio Ricarte Memorial School',
  '107960',
  'Public Elementary (Kindergarten to Grade 6)',
  'Brgy. Bagumbayan, General Trias City, Cavite',
  'Region IV-A CALABARZON',
  'Cavite',
  'General Trias City',
  'Division of General Trias City',
  '1894',
  'Mar T. Sta. Maria',
  'School Principal I',
  'Empowering Artemians with Quality, Excellence, Service, and Resilience',
  '(046) 472-5307',
  '107960@deped.gov.ph',
  'garms107960.edu.ph',
  'Monday–Friday, 8:00 AM – 5:00 PM',
  'https://maps.app.goo.gl/QBCD8vwwZJSNaMUE8',
  '/uploads/logo.png',
  '/uploads/principal.jpg'
);

-- Content Blocks
INSERT IGNORE INTO content_blocks (page_slug, section_key, title, body_richtext, sort_order) VALUES
('about', 'vision', 'Vision Statement',
'<p>We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.</p><p>As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.</p><p>General Artemio Ricarte Memorial School (GARMS) believed that the DepEd vision is a compass for attaining the main goal of education in providing quality education. The school envisions producing graduates that are well-rounded and good citizens of our country so that they can share their skills and talents for a maximum country\'s development, thereby collaborative efforts of internal and external stakeholders should adhere to providing quality education.</p><p>GARMS promotes a deep sense of patriotism and social responsibility among its learners by integrating values education and meaningful classroom and extracurricular activities that highlight love of country, discipline, and service. Through continuous improvement in teaching methods, facilities, and partnerships, the school ensures that students are equipped not only with academic knowledge but also with life skills necessary to contribute to nation-building.</p>',
1),

('about', 'mission', 'Mission Statement',
'<p>To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:</p><ul><li>Students learn in a child-friendly, gender-sensitive, safe, and motivating environment.</li><li>Teachers facilitate learning and constantly nurture every learner.</li><li>Administrators and staff, as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.</li><li>Family, community, and other stakeholders are actively engaged and share responsibility for developing life-long learners.</li></ul><p>GARMS implements inclusive and learner-centered programs that make sure all students, regardless of background, have access to quality education. Teachers are committed to professional growth to become better facilitators of learning. School leaders and non-teaching staff uphold their roles by creating safe, nurturing, and inclusive spaces. Moreover, the school actively engages with parents, barangay officials, and other community partners to uphold the shared responsibility of shaping well-rounded, lifelong learners.</p>',
2),

('about', 'core_values', 'Core Values',
'<p>GARMS instills these core values through daily classroom interactions, co-curricular activities, flag ceremonies, and community outreach.</p><ul><li><strong>Maka-Diyos:</strong> The school fosters respect for faith and spirituality by integrating moral and ethical lessons.</li><li><strong>Maka-Tao:</strong> Students are taught empathy, kindness, and the importance of human dignity.</li><li><strong>Makakalikasan:</strong> GARMS supports environmental protection through clean-up drives, waste segregation, and greening programs.</li><li><strong>Makabansa:</strong> Patriotism is cultivated through civic activities, history lessons, and commemorative events that honor national heroes, including its namesake General Artemio Ricarte.</li></ul>',
3),

('about', 'goals', 'School Goals & Objectives',
'<ol><li>Enhance the quality of teaching and learning through effective instructional practices.</li><li>Promote academic and personal excellence among learners and personnel.</li><li>Strengthen service-oriented leadership and stakeholder engagement.</li><li>Develop resilient learners and personnel through preparedness and wellness programs.</li></ol>',
4),

('about', 'history', 'School History',
'<p>General Artemio Ricarte Memorial School (GARMS) is one of the Elementary Schools in the city of General Trias situated at Bagumbayan, General Trias City. GARMS was established in the year 1894 and was known as the "Spanish Building." It is located in a very accessible part of the city, making it easy for learners, parents, and community members to reach.</p><p>Its site is surrounded by important establishments that help support the school\'s programs and activities. Being close to the City Hall allows the school to easily coordinate with the local government, making it faster to implement projects and access resources for the benefit of the learners. Just a short distance away is the church, which provides spiritual guidance and supports values formation activities that strengthen the character of students. The school is also near commercial areas, health facilities, and transportation hubs, which help ensure the safety, convenience, and well-being of both students and teachers.</p><p>Compared to other schools in the city, GARMS is unique because it carries the name of General Artemio Ricarte, a national hero, giving it a sense of pride, identity, and historical importance. More than just a school site, GARMS serves as a place where education, community, and culture meet.</p><p>The school proudly offers a complete basic elementary education for young learners from Kindergarten to Grade 6. Additionally, GARMS has built strong partnerships with various stakeholders in the community — including the Fraternal Eagles–New Lancaster City Eagles Club, Brgy. Councils of Bagumbayan, Vibora Poblacion, Sta. Clara, Pinagtipunan, San Gabriel Pob., Corregidor and Arnaldo, as well as McDonald\'s, Jollibee, Robinsons GenTri, and the School Parents and Teachers Association (SPTA).</p><p>The school\'s learners come from seven (7) nearby barangays: Pasong Camachile 1, Vibora Poblacion, Sta. Clara, Pinagtipunan, San Gabriel Pob., Corregidor, and Arnaldo. The school is adequately staffed with teaching personnel, maintaining a favorable teacher-to-student ratio of 1:35.</p>',
5),

('admissions', 'enrollment', 'Enrollment Information',
'<p>GARMS accepts learners from Kindergarten (ages 5–6) through Grade 6. As a public school, education is <strong>free of tuition fees</strong>.</p><h3>Enrollment Requirements</h3><ul><li>Birth Certificate (PSA-authenticated)</li><li>Report Card / Form 138 (for transferees and incoming Grade 2–6)</li><li>Certificate of Good Moral Character (for transferees)</li><li>Medical/Dental records (if available)</li><li>2x2 ID photo</li></ul><h3>Enrollment Process</h3><ol><li>Proceed to the school registrar to pick up an enrollment form.</li><li>Fill out the form and attach all required documents.</li><li>Submit the form at the office during enrollment period.</li><li>Wait for confirmation and class assignment.</li></ol><p>For inquiries, contact the school office at (046) 472-5307 during office hours (Monday–Friday, 8:00 AM – 5:00 PM).</p>',
1),

('citizens_charter', 'main', 'Citizen\'s Charter',
'<p>In compliance with Republic Act No. 11032, also known as the <strong>Ease of Doing Business and Efficient Government Service Delivery Act of 2018</strong>, General Artemio Ricarte Memorial School publishes its Citizen\'s Charter to inform the public of the services it provides, the requirements for each service, and the standard processing time.</p><p>The Citizen\'s Charter is a transparency mechanism that serves as a two-way document that communicates the services offered by the school, the standards set for those services, and the corresponding obligations of both the service providers and clients.</p><p>For the official DepEd Citizen\'s Charter, please visit: <a href="https://www.deped.gov.ph" target="_blank" rel="noopener noreferrer">www.deped.gov.ph</a></p>',
1);

-- Banner images
INSERT IGNORE INTO banner_images (image_url, caption, sort_order, is_active) VALUES
('/uploads/banner1.png', 'Empowering Artemians with Quality, Excellence, Service, and Resilience — GARMS Sa Tatag, GARMS Sa Kalidad!', 1, 1);

-- School photos
INSERT IGNORE INTO school_photos (image_url, caption, sort_order) VALUES
('/uploads/school_building.png', 'General Artemio Ricarte Memorial School — Main Building', 1);

-- Org chart
INSERT IGNORE INTO org_chart (image_url) VALUES ('/uploads/org_chart.png');

-- Officials
INSERT IGNORE INTO officials (full_name, position, department_office, sort_order) VALUES
('Mar T. Sta. Maria', 'School Principal I', 'School Administration', 1),
('Clarinda Dela Cruz Carandang', 'Administrative Officer II (AO2)', 'School Administration', 2);

-- Staff Directory
INSERT IGNORE INTO staff_directory (full_name, position_subject, section_name, department_grade_level, sort_order) VALUES
('Arline D. Lappay', 'Teacher III', 'Matapat', 'Kindergarten', 1),
('Mary Grace P. Reambillo', 'Teacher III', 'Masunurin', 'Kindergarten', 2),
('Kristina Casandra S. Longabela', 'Teacher III', 'Masinop', 'Kindergarten', 3),
('Nilda S. Francisco', 'Teacher III', 'Rosal', 'Grade 1', 4),
('Deannah H. Bulatao', 'Teacher IV', 'Dahlia', 'Grade 1', 5),
('Angelina E. Manalo', 'Teacher III', 'Sampaguita', 'Grade 1', 6),
('Shella B. Mahinay', 'Teacher II', 'Gumamela', 'Grade 1', 7),
('Evelyn E. Torres', 'Teacher III', 'Santan', 'Grade 1', 8),
('Leonora G. Pulido', 'Teacher II', 'Lansones', 'Grade 2', 9),
('Amie L. Amaran', 'Teacher II', 'Atis', 'Grade 2', 10),
('Lourdes S. Capitle', 'Teacher III', 'Mangga', 'Grade 2', 11),
('Amie A. Amarille', 'Teacher III', 'Pinya', 'Grade 2', 12),
('Ma. Lilibeth P. Legaspi', 'Teacher III', 'Chico', 'Grade 2', 13),
('Rosalia C. Awa-ao', 'Teacher I', 'Molave', 'Grade 3', 14),
('Jenica Carla P. De Luna', 'Teacher I', 'Acacia', 'Grade 3', 15),
('Verna N. Flandez', 'Teacher III', 'Mahogany', 'Grade 3', 16),
('Maricel D. Gonzales', 'Master Teacher I', 'Narra', 'Grade 3', 17),
('Denelyn F. Prodigalidad', 'Teacher VI', 'Aguinaldo', 'Grade 4', 18),
('Dioscora P. Hela', 'Teacher III', 'Laurel', 'Grade 4', 19),
('Charleen A. Cadalin', 'Teacher IV', 'Magsaysay', 'Grade 4', 20),
('Cristine C. Cardiño', 'Teacher I', 'Roxas', 'Grade 4', 21),
('Liza S. Torres', 'Teacher III', 'Quezon', 'Grade 4', 22),
('Jamaica Cuña', 'Teacher I', 'No Advisory', 'Grade 4', 23),
('Rosa T. Silagan', 'Teacher II', 'Diamond', 'Grade 5', 24),
('Diana V. Quintos', 'Teacher III', 'Amethyst', 'Grade 5', 25),
('Aniceta B. Ramos', 'Teacher III', 'Sapphire', 'Grade 5', 26),
('Michael M. Maestro', 'Teacher III', 'Emerald', 'Grade 5', 27),
('Aaron Paul O. Cruz', 'Teacher I', 'Topaz', 'Grade 5', 28),
('Zarrah P. Culla', 'Teacher III', 'Rizal', 'Grade 6', 29),
('Jasmin A. Dimaranan', 'Master Teacher II', 'Ricarte', 'Grade 6', 30),
('Emily O. Fabic', 'Master Teacher II', 'Bonifacio', 'Grade 6', 31),
('Josephine D. Mendoza', 'Teacher III', 'Luna', 'Grade 6', 32),
('Jomina M. Zamora', 'Teacher IV', 'No Advisory', 'Grade 6', 33),
('Christopher G. Amor', 'Teacher I', 'No Advisory', NULL, 34),
('Jennifer B. Santos', 'Master Teacher I', 'No Advisory', 'Grade 6', 35);

-- Committees
INSERT IGNORE INTO committees (committee_name, description, sort_order) VALUES
('School PTA / HPTA', 'School Parents and Teachers Association — Homeroom PTA officers for school year 2026-2027', 1),
('SPTA', 'School Parents and Teachers Association — School-level executive committee', 2),
('SSG / SPG', 'Supreme Student Government / Supreme Pupil Government', 3),
('School Discipline Committee', 'Maintains school discipline and addresses behavioral concerns', 4);

-- Academic Programs
INSERT IGNORE INTO academic_programs (grade_levels_offered, special_programs, cocurricular_activities, notable_achievements)
VALUES (
  'Kindergarten, Grade 1, Grade 2, Grade 3, Grade 4, Grade 5, Grade 6',
  'Regular curriculum in compliance with the K-12 Basic Education Program of the Department of Education',
  'Flag Ceremony, Reading Programs (ARAL), Intramurals, Brigada Eskwela, Feeding Program, Environmental Activities, Civic activities',
  'Awards and recognitions in citywide academic competitions and DepEd programs'
);

-- Enrollment info
INSERT IGNORE INTO enrollment_info (schedule, fees_note, contact_person, contact_number)
VALUES (
  'Enrollment is typically held at the start of each school year. Contact the school office for the exact schedule.',
  'Free / Public School — No tuition or miscellaneous fees for regular program',
  'Mar T. Sta. Maria, School Principal I',
  '(046) 472-5307'
);

-- PPAs
INSERT IGNORE INTO ppas (name, short_description, frequency, sort_order) VALUES
('Brigada Eskwela', 'Annual school maintenance and beautification program involving parents, alumni, and community volunteers', 'Annual', 1),
('Reading Month / ARAL Program', 'Intensive reading intervention program to improve literacy among learners', 'Annual/Quarterly', 2),
('Intramurals', 'Inter-class and inter-grade sports competition fostering sportsmanship and camaraderie', 'Annual', 3),
('Feeding Program', 'Supplemental feeding for undernourished learners in partnership with government and private donors', 'Quarterly', 4),
('Foundation Day', 'Celebration of the school\'s founding anniversary with cultural presentations and recognition ceremonies', 'Annual', 5),
('Recognition Day / Moving Up Ceremony', 'Annual recognition of academic achievers and moving-up ceremony for graduating learners', 'Annual', 6),
('Civic Consciousness Week', 'Activities promoting patriotism, national hero appreciation, and civic responsibility', 'Annual', 7),
('Environmental Programs', 'Tree planting, clean-up drives, waste segregation, and greening programs', 'Quarterly', 8);

-- Issuances — DepEd Orders
INSERT IGNORE INTO issuances (type, title, do_number, school_year, date_issued) VALUES
('deped_order', 'DO 006, s. 2026 – Guidelines on Ensuring a Safe and Motivating Learning Environment (ESMLE)', 'DO 006, s. 2026', '2025-2026', '2026-01-01'),
('deped_order', 'DO 009, s. 2026 – Guidelines on the Implementation of the Three-Term School Calendar in Basic Education', 'DO 009, s. 2026', '2025-2026', '2026-01-01'),
('deped_order', 'DO 010, s. 2026 – Guidelines for the Implementation of 2026 Summer Remediation Programs', 'DO 010, s. 2026', '2025-2026', '2026-01-01'),
('deped_order', 'DO 014, s. 2026 – Guidelines on Learning Continuity in Emergencies', 'DO 014, s. 2026', '2025-2026', '2026-01-01'),
('deped_order', 'DO 015, s. 2026 – Classroom Assessment, Grading System, and Awards and Recognition', 'DO 015, s. 2026', '2025-2026', '2026-01-01'),
('deped_order', 'DO 016, s. 2026 – Lesson Planning and Learning Design', 'DO 016, s. 2026', '2025-2026', '2026-01-01');

-- External Links
INSERT IGNORE INTO external_links (label, url, sort_order) VALUES
('DepEd Central Office', 'https://www.deped.gov.ph', 1),
('DepEd Orders (Official)', 'https://www.deped.gov.ph/orders/', 2),
('DepEd Memoranda (Official)', 'https://www.deped.gov.ph/memoranda/', 3),
('DepEd Region IV-A CALABARZON', 'https://www.depedcalabarzonnews.com', 4),
('DepEd Division of General Trias City', 'https://www.depedgeneraltrias.com', 5);

-- Citizen's Charter
INSERT IGNORE INTO citizens_charter (body_richtext) VALUES
('<p>In compliance with Republic Act No. 11032, also known as the <strong>Ease of Doing Business and Efficient Government Service Delivery Act of 2018</strong>, General Artemio Ricarte Memorial School publishes its Citizen\'s Charter to inform the public of the services it provides, the requirements for each service, and the standard processing time.</p><p>The Citizen\'s Charter is a commitment to efficient, transparent, and accountable public service delivery.</p><p>For the official DepEd Citizen\'s Charter, please visit: <a href="https://www.deped.gov.ph" target="_blank">www.deped.gov.ph</a></p>');

-- FAQs
INSERT IGNORE INTO faqs (question, answer_richtext, sort_order) VALUES
('What grade levels does GARMS offer?', '<p>GARMS offers complete basic elementary education from <strong>Kindergarten to Grade 6</strong>.</p>', 1),
('Is there a tuition fee?', '<p>No. GARMS is a <strong>public school</strong> under the Department of Education. Education is free of tuition and other mandatory fees.</p>', 2),
('What are the enrollment requirements?', '<p>Basic enrollment requirements include:</p><ul><li>PSA Birth Certificate</li><li>Report Card / Form 138 (for incoming Grade 2–6 or transferees)</li><li>Certificate of Good Moral Character (for transferees)</li><li>2x2 ID photo</li></ul>', 3),
('How do I contact the school?', '<p>You may reach us at:</p><ul><li><strong>Phone:</strong> (046) 472-5307</li><li><strong>Email:</strong> 107960@deped.gov.ph</li><li><strong>Office Hours:</strong> Monday–Friday, 8:00 AM – 5:00 PM</li></ul>', 4),
('Where is GARMS located?', '<p>GARMS is located at <strong>Brgy. Bagumbayan, General Trias City, Cavite</strong>. It is easily accessible and situated near the City Hall, local church, and commercial areas.</p>', 5),
('What programs and activities does GARMS offer?', '<p>GARMS offers the standard K-12 curriculum plus co-curricular activities including Intramurals, Reading Month/ARAL Program, Brigada Eskwela, Feeding Program, Environmental Programs, and civic activities honoring national heroes.</p>', 6),
('How can I submit feedback or concerns?', '<p>You may send your feedback or concerns through our Contact Us form on this website, or visit the school office during office hours.</p>', 7);

-- BOSY Enrollment Statistics (SY 2024-2025, 2025-2026, 2026-2027)
INSERT IGNORE INTO enrollment_stats
  (school_year, sort_order,
   kinder_male, kinder_female,
   grade1_male, grade1_female,
   grade2_male, grade2_female,
   grade3_male, grade3_female,
   grade4_male, grade4_female,
   grade5_male, grade5_female,
   grade6_male, grade6_female)
VALUES
  ('2024-2025', 1,  75, 80,  80,  65,  80,  84,  87, 109,  81, 88,  87, 82,  98, 86),
  ('2025-2026', 2,  72, 96,  68,  84,  76,  68,  85,  89,  91,110,  81, 86,  86, 82),
  ('2026-2027', 3,  48, 65,  77, 100,  68,  83,  73,  65,  89, 88, 105,105,  78, 88);
-- Note: chart_image_url is NULL by default; upload via Admin → Enrollment Statistics after deploy.

-- Calendar events
INSERT IGNORE INTO calendar_events (event_name, start_date, end_date, is_recurring, category) VALUES
('School Year Opening', '2026-08-24', NULL, 1, 'academic'),
('Brigada Eskwela', '2026-08-18', '2026-08-22', 1, 'event'),
('Foundation Day', '2026-10-15', NULL, 1, 'special'),
('Recognition Day / Moving Up Ceremony', '2027-04-01', NULL, 1, 'academic'),
('National Heroes Day', '2026-08-31', NULL, 1, 'holiday'),
('Bonifacio Day', '2026-11-30', NULL, 1, 'holiday'),
('Rizal Day', '2026-12-30', NULL, 1, 'holiday'),
('Christmas Break', '2026-12-21', '2027-01-02', 1, 'holiday');

-- Feedback links
INSERT IGNORE INTO feedback_links (label, url, type) VALUES
('Client Satisfaction Measurement (CSM) Survey', NULL, 'csm_survey'),
('General Feedback / Suggestion Form', NULL, 'general_feedback');

-- Learning Resources
INSERT IGNORE INTO learning_resources (category, title, description) VALUES
('ARAL', 'ARAL Summer – Filipino', 'ARAL reading materials for Filipino language, summer program'),
('ARAL', 'ARAL Reading – English', 'ARAL reading intervention materials for English'),
('ARAL', 'ARAL Materials (General)', 'General ARAL program materials'),
('ARAL', 'Pyramid Reading (Set 1)', 'Pyramid reading intervention materials'),
('ARAL', 'Pyramid Reading (Set 2)', 'Pyramid reading intervention materials — Set 2'),
('ARAL', 'Pyramid Reading (Set 3)', 'Pyramid reading intervention materials — Set 3');
