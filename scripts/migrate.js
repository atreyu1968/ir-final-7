import { db } from '../src/config/database.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const migrations = [
  {
    name: '001_initial_schema',
    up: readFileSync(join(process.cwd(), 'sql/migrations/001_initial_schema.sql'), 'utf8'),
    down: readFileSync(join(process.cwd(), 'sql/migrations/001_initial_schema_down.sql'), 'utf8'),
  },
];

async function migrate() {
  try {
    // Create migrations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get applied migrations
    const appliedMigrations = await db.query('SELECT name FROM migrations');
    const appliedNames = new Set(appliedMigrations.map(m => m.name));

    // Apply pending migrations
    for (const migration of migrations) {
      if (!appliedNames.has(migration.name)) {
        console.log(`Applying migration: ${migration.name}`);
        
        await db.transaction(async (conn) => {
          await conn.query(migration.up);
          await conn.query('INSERT INTO migrations (name) VALUES (?)', [migration.name]);
        });
        
        console.log(`Migration ${migration.name} applied successfully`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

migrate();