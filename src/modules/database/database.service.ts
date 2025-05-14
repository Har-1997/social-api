import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {

  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  private readonly logger = new Logger(DatabaseService.name);

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`SQL: ${text} | Params: ${JSON.stringify(params)}`);
      }

      return await this.pool.query(text, params);
    } catch (error) {
      this.logger.error(`Query failed: ${text}`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database pool has been closed.');
  }
}
