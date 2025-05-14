import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FriendsModule  } from './modules/friends/friends.module';
import { TablesMigrationService } from './modules/database/migrations/tables-migration.service';
import { DbMigrationService } from './modules/database/migrations/db-migration.service';
import { MailModule } from './modules/mail/mail.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MailModule,
    AuthModule,
    UsersModule,
    FriendsModule 
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DbMigrationService,
    TablesMigrationService,
  ],
})
export class AppModule {}
