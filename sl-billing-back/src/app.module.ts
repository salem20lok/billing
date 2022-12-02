import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './user/commands/user.command';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { TeamModule } from './team/team.module';
import { PermissionModule } from './permission/permission.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { TeamUserModule } from './team-user/team-user.module';
import { UploadModule } from './upload/upload.module';
import { PlanModule } from './plan/plan.module';
import { FeatureModule } from './feature/feature.module';
import { PlanFeatureModule } from './plan-feature/plan-feature.module';
import { TeamFeatureModule } from './team-feature/team-feature.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CommandModule,
    MailModule,
    TeamModule,
    PermissionModule,
    UserPermissionModule,
    TeamUserModule,
    UploadModule,
    PlanModule,
    FeatureModule,
    PlanFeatureModule,
    TeamFeatureModule,
  ],
  controllers: [],
  providers: [UserCommand, UserService],
})
export class AppModule {}
