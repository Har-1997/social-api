import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

@Injectable()
export class TablesMigrationService {
  private readonly logger = new Logger(TablesMigrationService.name);
  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async runMigrations() {
    try {
      const sql = readFileSync(join(__dirname, '..', 'sql', 'init.sql'), 'utf-8');
      await this.pool.query(sql);
      this.logger.log('Database initialized.');
    } catch (error) {
      this.logger.error('Creating tables migration failed!', error);
      throw error;
    } finally {
      await this.pool.end();
    }
  }
}
