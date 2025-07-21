import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ModulesModule } from './modules/modules.module';
import { AuthModule } from './authentication/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ModulesModule,
    UsersModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule { }
