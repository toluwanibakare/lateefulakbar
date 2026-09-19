import mysql from 'mysql2/promise';

const DB_HOST = process.env.MYSQL_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.MYSQL_PORT) || 3306;
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.MYSQL_DATABASE || 'lateeful_akbar';

let pool: mysql.Pool | null = null;
let initialized = false;

export async function getDb() {
  if (!pool) {
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await rootConnection.end();

    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  if (!initialized) {
    await initSchema(pool);
    initialized = true;
  }

  return pool;
}

async function initSchema(p: mysql.Pool) {
  try {
    // 1. Registrations table with referral code & referrer support
    await p.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        ticket_type VARCHAR(100) DEFAULT 'Standard Pass',
        pass_code VARCHAR(50) UNIQUE NOT NULL,
        referral_code VARCHAR(50) UNIQUE,
        referred_by VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 1a. Migrate older `registrations` tables that were created before
    // referral_code / referred_by / status columns existed.
    // CREATE TABLE IF NOT EXISTS won't alter an existing table, so an old
    // table causes "Unknown column 'referral_code'" -> 500 on /api/register.
    // Add any missing columns idempotently.
    const [regCols] = await p.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'registrations'`,
      [DB_NAME]
    );
    const existingRegCols = new Set(
      (regCols as Array<{ COLUMN_NAME: string }>).map((c) => c.COLUMN_NAME)
    );
    const regMigrations: Array<{ name: string; ddl: string }> = [
      { name: 'referral_code', ddl: `ALTER TABLE registrations ADD COLUMN referral_code VARCHAR(50) UNIQUE` },
      { name: 'referred_by', ddl: `ALTER TABLE registrations ADD COLUMN referred_by VARCHAR(50)` },
      { name: 'status', ddl: `ALTER TABLE registrations ADD COLUMN status VARCHAR(50) DEFAULT 'active'` },
    ];
    for (const m of regMigrations) {
      if (!existingRegCols.has(m.name)) {
        await p.query(m.ddl);
      }
    }
    await p.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT,
        social_handle VARCHAR(100),
        category VARCHAR(100) NOT NULL,
        sub_category VARCHAR(255),
        description TEXT,
        spaces INT DEFAULT 1,
        electricity VARCHAR(10) DEFAULT 'No',
        power_details TEXT,
        staff_count INT DEFAULT 2,
        total_price DECIMAL(12,2) DEFAULT 0.00,
        pass_code VARCHAR(50) UNIQUE,
        payment_ref VARCHAR(100),
        status VARCHAR(50) DEFAULT 'approved',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await p.query(`
      CREATE TABLE IF NOT EXISTS tasbih (
        id INT PRIMARY KEY DEFAULT 1,
        count BIGINT NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.query(`
      INSERT IGNORE INTO tasbih (id, count) VALUES (1, 0);
    `);

    // 3. Donations table
    await p.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_name VARCHAR(255) DEFAULT 'Anonymous',
        email VARCHAR(255),
        amount DECIMAL(12,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        tx_ref VARCHAR(100) UNIQUE,
        status VARCHAR(50) DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Blog stats
    await p.query(`
      CREATE TABLE IF NOT EXISTS blog_stats (
        slug VARCHAR(255) PRIMARY KEY,
        likes INT DEFAULT 0,
        views INT DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Support tickets
    await p.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        query TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Chat logs
    await p.query(`
      CREATE TABLE IF NOT EXISTS chat_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100),
        user_message TEXT,
        bot_reply TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Activity Log table
    await p.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_email VARCHAR(255) NOT NULL,
        admin_name VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Event Updates / Announcements
    await p.query(`
      CREATE TABLE IF NOT EXISTS event_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        priority VARCHAR(50) DEFAULT 'normal',
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. Newsletter Subscribers
    await p.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. Sadaqah Campaigns table
    await p.query(`
      CREATE TABLE IF NOT EXISTS sadaqah_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        target_qty INT DEFAULT 100,
        current_qty INT DEFAULT 0,
        unit_price DECIMAL(12,2) DEFAULT 0.00,
        image_url VARCHAR(500),
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. AI Knowledge Base override table
    await p.query(`
      CREATE TABLE IF NOT EXISTS ai_knowledge (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        question VARCHAR(500) NOT NULL,
        answer TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 12. App Settings key-value table
    await p.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 12b. Event Schedule table for admin management
    await p.query(`
      CREATE TABLE IF NOT EXISTS event_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time_slot VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        note TEXT,
        item_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default schedule items if empty
    const [existingSched] = await p.query<mysql.RowDataPacket[]>('SELECT COUNT(*) as count FROM event_schedule');
    if (existingSched[0]?.count === 0) {
      await p.query(`
        INSERT INTO event_schedule (time_slot, title, note, item_order) VALUES
        ('08:00 AM', 'Daily Fortification', 'Opening fortification, accreditation, seating by canopy, and quiet preparation.', 1),
        ('09:30 AM', 'Welcome & Introduction', 'Opening address from Nadwat Global Assembly, setting intentions together.', 2),
        ('10:15 AM', 'Thanksgiving', 'Reflecting on blessings and giving gratitude for answered prayers.', 3),
        ('10:45 AM', 'Islamic Lecture / Spiritual Exhortation', 'Inspiring talk and spiritual guidance by guest scholars and the convener.', 4),
        ('11:30 AM', 'Collective Dhikr & Istighfār', 'Seeking forgiveness and chanting remembrance in unison.', 5),
        ('12:15 PM', 'Salawāt upon Prophet Muhammad ﷺ', 'Sending blessings upon the Holy Prophet with deep devotion.', 6),
        ('01:00 PM', 'Special Yā Lateef Dhikr', 'The grand collective Yā Lateef tasbīh recitation across the venue.', 7),
        ('02:00 PM', 'Guided Duʿā & Supplications', 'Focused prayers for family, health, business, career, marriage, education, protection, prosperity and life concerns.', 8),
        ('03:00 PM', 'Special Prayer for the Ummah', 'Unifying prayers for peace, security, and relief for Muslims worldwide.', 9),
        ('03:30 PM', 'Closing Duʿā & Remarks', 'Final blessings, closing announcements, and orderly dispersal.', 10)
      `);
    }

    // 13. Dynamic Blog Posts table
    await p.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(500) NOT NULL,
        read_time VARCHAR(50) DEFAULT '5 min',
        author VARCHAR(100) DEFAULT 'Nadwat Media',
        is_published TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed initial blog posts if empty
    const [existingBlogs] = await p.query<mysql.RowDataPacket[]>('SELECT COUNT(*) as count FROM blog_posts');
    if (existingBlogs[0]?.count === 0) {
      await p.query(`
        INSERT INTO blog_posts (slug, title, category, excerpt, content, image, read_time, author) VALUES
        ('sea-of-white', 'What a sea of white does to a city', 'Field Notes', 'TBS holds noise well. On the day, it held silence better - 40,000 people breathing the same dhikr.', 'National Mosque Auditorium holds noise well — it was built for gatherings and crowds. On the day of the seating, it held silence better. Thousands of people in white, breathing the same dhikr, and the loudest thing for long stretches was water being passed hand to hand.\n\nStewards will tell you the order is the worship. Sections settle by canopy, shoes aligned, mats edge to edge. From the venue floor the auditorium stops looking like a crowd and starts looking like cloth — one fabric, briefly unseamed by the service lanes.\n\nIf you come for the first time, come early. Watch the venue fill. That slow whitening of the stands is the closest thing Abuja has to dawn arriving twice.', '/assets/crowd-67.jpg', '6 min', 'Nadwat Editorial'),
        ('ya-lateef', 'Yaa Lateef: the Name we gather under', 'Meaning', 'Subtlety, kindness, the grace that arrives before you ask. A short reading for first-time guests.', 'Al-Lateef — the Most Gentle, the Most Subtle. The kindness that arrives before you ask, the opening that appears inside difficulty without breaking anything. Scholars linger on this Name because it answers the quiet fear: that our affairs are too tangled for mercy to find.\n\nAt the gathering the Name is recited long and low, led from the stage and answered by the whole hall. There is no hurry in it. Guests are asked to bring one private need and hold it lightly through the recitation — the asking is the worship.\n\nCome with ablution, come in white, come having forgiven one person. That is the whole preparation the convener asks of first-time guests.', '/assets/crowd-18.jpg', '4 min', 'Scholar Reflections'),
        ('tbs-logistics', 'Coming to the Square: gates, seating, water', 'Guide', 'Where the brothers sit, where the sisters sit, where the water and fans are - a plain-language walkthrough.', 'Brothers sit in the ordered section on one side, sisters under the main hall section on the other — stewarded by section, first come first served. Elders and guests with medical needs are seated nearest the service lanes; tell a steward at the gate and you will be walked there.\n\nWater moves through the rows all morning, funded by sadaqah. Fans hold the midday heat inside the hall. All vehicles use designated parking areas outside the main auditorium.\n\nGates open at 08:00 with accreditation and QR scanning. The opening and Bismillah follow at 09:30, the long Yaa Lateef seating at 10:30, reflections at midday, and the grand du‘ā — the day''s peak — at 14:00. Dispersal is orderly, section by section.', '/assets/crowd-11.jpg', '8 min', 'Event Logistics')
      `);
    }

    // 14. Gallery & Media Items table
    await p.query(`
      CREATE TABLE IF NOT EXISTS gallery_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        url VARCHAR(500) NOT NULL,
        span VARCHAR(50) DEFAULT 'normal',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed initial gallery media items if empty
    const [existingGallery] = await p.query<mysql.RowDataPacket[]>('SELECT COUNT(*) as count FROM gallery_media');
    if (existingGallery[0]?.count === 0) {
      await p.query(`
        INSERT INTO gallery_media (title, category, url) VALUES
        ('The sisters'' canopy - thousands in white', 'Gathering', '/assets/gallery/gathering/crowd-08.jpg'),
        ('The stands fill at TBS', 'Gathering', '/assets/gallery/gathering/crowd-49.jpg'),
        ('A sea that stretches on', 'Gathering', '/assets/gallery/gathering/crowd-67.jpg'),
        ('Arrival tide at the gates', 'Gathering', '/assets/gallery/gathering/crowd-80.jpg'),
        ('The convener at dhikr', 'People', '/assets/gallery/people/crowd-15.jpg'),
        ('Brothers in quiet reflection', 'People', '/assets/gallery/people/crowd-30.jpg'),
        ('Scholars on stage', 'People', '/assets/gallery/people/crowd-63.jpg'),
        ('Hands raised in du''a', 'Atmosphere', '/assets/gallery/atmosphere/crowd-18.jpg'),
        ('Midday recitation at TBS', 'Atmosphere', '/assets/gallery/atmosphere/crowd-48.jpg'),
        ('Aerial panorama of Tafawa Balewa Square', 'Drone', '/assets/gallery/drone/crowd-12.jpg')
      `);
    }

  } catch (err) {
    console.error('Error initializing MySQL database schema:', err);
  }
}
