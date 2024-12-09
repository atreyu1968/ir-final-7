import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'dev.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, 'db/migrations')
    },
    seeds: {
      directory: join(__dirname, 'db/seeds')
    }
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, 'prod.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, 'db/migrations')
    },
    seeds: {
      directory: join(__dirname, 'db/seeds')
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};