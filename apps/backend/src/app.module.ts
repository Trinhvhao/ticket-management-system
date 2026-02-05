import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { entities } from './database/entities';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { TicketHistoryModule } from './modules/ticket-history/ticket-history.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SlaModule } from './modules/sla/sla.module';
import { BusinessHoursModule } from './modules/business-hours/business-hours.module';
import { EscalationModule } from './modules/escalation/escalation.module';
import { HolidaysModule } from './modules/holidays/holidays.module';
import { DebugModule } from './modules/debug/debug.module';
import { AuditLog } from './database/entities/audit-log.entity';
import { AuditLogService } from './common/services/audit-log.service';
// import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database - PostgreSQL with Sequelize
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const dbHost = configService.get<string>('DB_HOST') || 'localhost';
                const dbPort = parseInt(configService.get<string>('DB_PORT') || '5432', 10);
                const dbUser = configService.get<string>('DB_USER') || 'postgres';
                const dbPass = configService.get<string>('DB_PASS') || '';
                const dbName = configService.get<string>('DB_NAME') || 'postgres';
                const dbSsl = configService.get<string>('DB_SSL') === 'true';
                const nodeEnv = configService.get<string>('NODE_ENV');

                const config: any = {
                    dialect: 'postgres',
                    host: dbHost,
                    port: dbPort,
                    username: dbUser,
                    password: dbPass,
                    database: dbName,
                    models: entities, // Use our entities array
                    autoLoadModels: false, // We're explicitly providing models
                    synchronize: false, // Use migrations instead
                    logging: nodeEnv === 'development' ? console.log : false,
                    pool: {
                        max: parseInt(configService.get<string>('DB_POOL_MAX') || '10', 10),
                        min: parseInt(configService.get<string>('DB_POOL_MIN') || '2', 10),
                        acquire: 30000,
                        idle: parseInt(configService.get<string>('DB_POOL_IDLE') || '10000', 10),
                    },
                    define: {
                        timestamps: true,
                        underscored: false,
                        freezeTableName: true,
                    },
                };

                if (dbSsl) {
                    config.dialectOptions = {
                        ssl: {
                            require: true,
                            rejectUnauthorized: false,
                        },
                    };
                }

                return config;
            },
            inject: [ConfigService],
        }),

        // Audit Log Model
        SequelizeModule.forFeature([AuditLog]),

        // Rate limiting
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const ttl = parseInt(configService.get<string>('RATE_LIMIT_WINDOW_MS') || '900000', 10);
                const limit = parseInt(configService.get<string>('RATE_LIMIT_MAX_REQUESTS') || '100', 10);

                return [{
                    ttl,
                    limit,
                }];
            },
            inject: [ConfigService],
        }),

        // Feature modules
        AuthModule,
        CategoriesModule,
        TicketsModule,
        CommentsModule,
        UsersModule,
        KnowledgeModule,
        ChatbotModule,
        NotificationsModule,
        AttachmentsModule,
        TicketHistoryModule,
        ReportsModule,
        SlaModule,
        BusinessHoursModule,
        EscalationModule,
        HolidaysModule,
        DebugModule, // Debug module for timezone and other diagnostics
    ],
    controllers: [AppController],
    providers: [
        AuditLogService,
        // Temporarily disabled - audit_logs table not created yet
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: AuditInterceptor,
        // },
    ],
})
export class AppModule { }
