import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbMigrationService {
  private readonly logger = new Logger(DbMigrationService.name);

  async createDatabaseIfNotExists() {
    const dbUrl: string = process.env.DATABASE_URL ?? '';
    const dbName = new URL(dbUrl).pathname.slice(1);
    const userUrl = dbUrl.replace(`/${dbName}`, '/postgres'); // connect to default "postgres" db

    const pool = new Pool({ connectionString: userUrl });

    try {
      const result = await pool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
      if (result.rowCount === 0) {
        await pool.query(`CREATE DATABASE ${dbName}`);
        this.logger.log(`Database "${dbName}" created.`);
      } else {
        this.logger.log(`Database "${dbName}" already exists.`);
      }
    } catch (error) {
      this.logger.error('Error creating database:', error);
      throw error;
    } finally {
      await pool.end();
    }
  }
}
