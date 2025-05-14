import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TablesMigrationService } from './modules/database/migrations/tables-migration.service';
import { DbMigrationService } from './modules/database/migrations/db-migration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'development') {
    // Create DB if it doesn't exist
    const dbBootstrap = app.get(DbMigrationService);
    await dbBootstrap.createDatabaseIfNotExists();

    // Run DB tables creation
    const tablesMigration = app.get(TablesMigrationService);
    await tablesMigration.runMigrations();
  }

  await app.listen(process.env.PORT ?? 5004);
}
bootstrap();
