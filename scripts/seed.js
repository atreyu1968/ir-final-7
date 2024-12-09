import { db } from '../src/config/database.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const seeds = [
  {
    name: '001_admin_user',
    sql: readFileSync(join(process.cwd(), 'sql/seeds/001_admin_user.sql'), 'utf8'),
  },
  {
    name: '002_master_records',
    sql: readFileSync(join(process.cwd(), 'sql/seeds/002_master_records.sql'), 'utf8'),
  },
];

async function seed() {
  try {
    // Create seeds table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS seeds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get applied seeds
    const appliedSeeds = await db.query('SELECT name FROM seeds');
    const appliedNames = new Set(appliedSeeds.map(s => s.name));

    // Apply pending seeds
    for (const seed of seeds) {
      if (!appliedNames.has(seed.name)) {
        console.log(`Applying seed: ${seed.name}`);
        
        await db.transaction(async (conn) => {
          await conn.query(seed.sql);
          await conn.query('INSERT INTO seeds (name) VALUES (?)', [seed.name]);
        });
        
        console.log(`Seed ${seed.name} applied successfully`);
      }
    }

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

seed();