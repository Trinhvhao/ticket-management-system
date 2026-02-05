import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Ticket } from '../../database/entities/ticket.entity';
import { User } from '../../database/entities/user.entity';

interface TimezoneCheckResult {
  serverInfo: {
    currentTime: string;
    currentTimeISO: string;
    currentTimeUTC: string;
    serverTimezone: string;
    nodeVersion: string;
    platform: string;
  };
  databaseInfo: {
    currentTimestamp: string;
    currentTimestampTZ: string;
    databaseTimezone: string;
    showTimezone: string;
  };
  columnTypes: {
    tableName: string;
    columnName: string;
    dataType: string;
    isTimestamptz: boolean;
  }[];
  sampleData: {
    tickets: {
      id: number;
      ticketNumber: string;
      createdAt: string;
      createdAtRaw: unknown;
      dueDate: string | null;
      dueDateRaw: unknown;
    }[];
    users: {
      id: number;
      email: string;
      createdAt: string;
      createdAtRaw: unknown;
    }[];
  };
  analysis: {
    issue: string;
    severity: 'OK' | 'WARNING' | 'CRITICAL';
    recommendation: string;
  }[];
}

@Controller('debug/timezone')
export class TimezoneCheckController {
  constructor(
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

  @Get('check')
  async checkTimezone(): Promise<TimezoneCheckResult> {
    const now = new Date();
    const analysis: TimezoneCheckResult['analysis'] = [];

    // 1. Server Info
    const serverInfo = {
      currentTime: now.toString(),
      currentTimeISO: now.toISOString(),
      currentTimeUTC: now.toUTCString(),
      serverTimezone: process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
    };

    // 2. Database Info
    const [dbResult] = await this.sequelize.query(`
      SELECT 
        CURRENT_TIMESTAMP as current_timestamp,
        CURRENT_TIMESTAMP AT TIME ZONE 'UTC' as current_timestamp_utc,
        CURRENT_SETTING('TIMEZONE') as db_timezone,
        TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS TZ') as now_with_tz
    `) as [{ current_timestamp: string; current_timestamp_utc: string; db_timezone: string; now_with_tz: string }[], unknown];

    const databaseInfo = {
      currentTimestamp: String(dbResult[0]?.current_timestamp || 'N/A'),
      currentTimestampTZ: String(dbResult[0]?.current_timestamp_utc || 'N/A'),
      databaseTimezone: String(dbResult[0]?.db_timezone || 'N/A'),
      showTimezone: String(dbResult[0]?.now_with_tz || 'N/A'),
    };

    // 3. Check Column Types
    const [columnTypesResult] = await this.sequelize.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        CASE WHEN data_type = 'timestamp with time zone' THEN true ELSE false END as is_timestamptz
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND (column_name LIKE '%_at' OR column_name LIKE '%_date' OR column_name = 'timestamp')
      ORDER BY table_name, column_name
    `) as [{ table_name: string; column_name: string; data_type: string; is_timestamptz: boolean }[], unknown];

    const columnTypes = (columnTypesResult as { table_name: string; column_name: string; data_type: string; is_timestamptz: boolean }[]).map(row => ({
      tableName: row.table_name,
      columnName: row.column_name,
      dataType: row.data_type,
      isTimestamptz: row.is_timestamptz,
    }));

    // Check for non-timestamptz columns
    const nonTimestamptzColumns = columnTypes.filter(col => !col.isTimestamptz && col.dataType.includes('timestamp'));
    if (nonTimestamptzColumns.length > 0) {
      analysis.push({
        issue: `Found ${nonTimestamptzColumns.length} timestamp columns WITHOUT timezone: ${nonTimestamptzColumns.map(c => `${c.tableName}.${c.columnName}`).join(', ')}`,
        severity: 'CRITICAL',
        recommendation: 'Run migration 008-convert-to-timestamptz.sql to convert to TIMESTAMPTZ',
      });
    } else {
      analysis.push({
        issue: 'All timestamp columns use TIMESTAMPTZ',
        severity: 'OK',
        recommendation: 'No action needed',
      });
    }

    // 4. Sample Data
    const tickets = await this.ticketModel.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const users = await this.userModel.findAll({
      limit: 3,
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const sampleData = {
      tickets: tickets.map(t => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        createdAt: t.createdAt ? new Date(t.createdAt as unknown as string).toISOString() : 'null',
        createdAtRaw: t.createdAt,
        dueDate: t.dueDate ? new Date(t.dueDate as unknown as string).toISOString() : null,
        dueDateRaw: t.dueDate,
      })),
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        createdAt: u.createdAt ? new Date(u.createdAt as unknown as string).toISOString() : 'null',
        createdAtRaw: u.createdAt,
      })),
    };

    // 5. Timezone difference analysis
    if (tickets.length > 0) {
      const ticket = tickets[0]!;
      if (ticket) {
        const createdAtDate = new Date(ticket.createdAt as unknown as string);
        const dueDateDate = ticket.dueDate ? new Date(ticket.dueDate as unknown as string) : null;
        
        if (dueDateDate) {
          const diffHours = (dueDateDate.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60);
          
          if (diffHours < 10) {
            analysis.push({
              issue: `Ticket ${ticket.ticketNumber}: Due date is only ${diffHours.toFixed(1)} hours from created date. This might indicate timezone issues or business hours calculation.`,
              severity: 'WARNING',
              recommendation: 'Check if SLA uses business hours vs calendar hours. Also verify timezone handling.',
            });
          } else {
            analysis.push({
              issue: `Ticket ${ticket.ticketNumber}: Due date is ${diffHours.toFixed(1)} hours from created date.`,
              severity: 'OK',
              recommendation: 'Time difference looks reasonable',
            });
          }
        }
      }
    }

    return {
      serverInfo,
      databaseInfo,
      columnTypes,
      sampleData,
      analysis,
    };
  }

  @Get('raw-query')
  async rawQuery(@Query('table') table: string = 'tickets'): Promise<unknown> {
    // Sanitize table name to prevent SQL injection
    const allowedTables = ['tickets', 'users', 'comments', 'categories'];
    if (!allowedTables.includes(table)) {
      return { error: `Invalid table. Allowed: ${allowedTables.join(', ')}` };
    }

    const [result] = await this.sequelize.query(`
      SELECT 
        id,
        created_at,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS TZ') as created_at_formatted,
        updated_at,
        TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS TZ') as updated_at_formatted
        ${table === 'tickets' ? ", due_date, TO_CHAR(due_date, 'YYYY-MM-DD HH24:MI:SS TZ') as due_date_formatted" : ''}
      FROM ${table}
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return {
      table,
      data: result,
      serverTime: new Date().toISOString(),
    };
  }

  @Get('create-test')
  async createTestTimestamp(): Promise<unknown> {
    const now = new Date();
    const nowPlus48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Insert a test record and read it back
    const [insertResult] = await this.sequelize.query(`
      INSERT INTO tickets (
        ticket_number, title, description, category_id, priority, status,
        submitter_id, created_at, updated_at, due_date
      )
      VALUES (
        'TKT-TEST-${Date.now()}',
        'Timezone Test Ticket',
        'Test description for timezone verification',
        (SELECT id FROM categories LIMIT 1),
        'High',
        'New',
        (SELECT id FROM users WHERE role = 'user' LIMIT 1),
        NOW(),
        NOW(),
        NOW() + INTERVAL '48 hours'
      )
      RETURNING 
        id,
        ticket_number,
        created_at,
        TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS TZ') as created_at_tz,
        due_date,
        TO_CHAR(due_date, 'YYYY-MM-DD HH24:MI:SS TZ') as due_date_tz,
        (EXTRACT(EPOCH FROM due_date) - EXTRACT(EPOCH FROM created_at)) / 3600 as diff_hours
    `) as [{ id: number; ticket_number: string; created_at: string; created_at_tz: string; due_date: string; due_date_tz: string; diff_hours: number }[], unknown];

    const insertedData = (insertResult as { id: number; ticket_number: string; created_at: string; created_at_tz: string; due_date: string; due_date_tz: string; diff_hours: number }[])[0];

    return {
      message: 'Test ticket created',
      jsDateTime: {
        now: now.toISOString(),
        nowPlus48Hours: nowPlus48Hours.toISOString(),
        expectedDiffHours: 48,
      },
      databaseResult: insertedData,
      analysis: {
        diffHours: insertedData?.diff_hours,
        isCorrect: Math.abs(Number(insertedData?.diff_hours) - 48) < 0.1,
      },
    };
  }

  @Get('cleanup-test')
  async cleanupTestTickets(): Promise<unknown> {
    const [result] = await this.sequelize.query(`
      DELETE FROM tickets 
      WHERE ticket_number LIKE 'TKT-TEST-%'
      RETURNING ticket_number
    `);

    return {
      message: 'Test tickets cleaned up',
      deleted: result,
    };
  }
}
