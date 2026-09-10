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
    // 1. Ensure database exists
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await rootConnection.end();

    // 2. Create pool attached to target database
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
    // Registrations table
    await p.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        ticket_type VARCHAR(100) DEFAULT 'Standard Pass',
        pass_code VARCHAR(50) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Tasbih count table (single row global counter)
    await p.query(`
      CREATE TABLE IF NOT EXISTS tasbih (
        id INT PRIMARY KEY DEFAULT 1,
        count BIGINT NOT NULL DEFAULT 128450,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default tasbih row if empty
    await p.query(`
      INSERT IGNORE INTO tasbih (id, count) VALUES (1, 128450);
    `);

    // Donations table
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

    // Blog engagement (likes & views per slug)
    await p.query(`
      CREATE TABLE IF NOT EXISTS blog_stats (
        slug VARCHAR(255) PRIMARY KEY,
        likes INT DEFAULT 0,
        views INT DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Support tickets (for Customer Support Handoff)
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

    // Chat history / analytics
    await p.query(`
      CREATE TABLE IF NOT EXISTS chat_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100),
        user_message TEXT,
        bot_reply TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (err) {
    console.error('Error initializing MySQL database schema:', err);
  }
}
