// src/google-sheets/google-sheets.service.ts
import { Injectable } from '@nestjs/common';
import { google, Auth, sheets_v4 } from 'googleapis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class GoogleSheetService {
  private readonly sheets: sheets_v4.Sheets;
  private readonly spreadsheetId: string;
  private auth: Auth.GoogleAuth;

  constructor(private readonly configService: ConfigService) {
    const credentials = this.configService.getGoogleCredentials();
    this.spreadsheetId = this.configService.getSpreadsheetId();

    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async appendRows(sheetName: string, rows: any[][]) {
    if (rows.length === 0) return;
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${this.formatSheetRange(sheetName)}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
  }

  async appendObjectRow(options: {
    spreadsheetId?: string;
    sheetName?: string;
    row: Record<string, string | number | boolean | null | undefined>;
    defaultHeaders: string[];
  }) {
    const spreadsheetId = options.spreadsheetId || this.spreadsheetId;
    const sheetName =
      options.sheetName || (await this.getFirstSheetName(spreadsheetId));
    const headers = await this.getOrCreateHeaders(
      spreadsheetId,
      sheetName,
      options.defaultHeaders,
    );
    const row = headers.map((header) => {
      const key = this.normalizeHeader(header);
      return options.row[key] ?? '';
    });

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${this.formatSheetRange(sheetName)}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
  }

  private async getFirstSheetName(spreadsheetId: string): Promise<string> {
    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties.title',
    });
    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title;
    if (!firstSheetName) {
      throw new Error('No sheets found in the spreadsheet.');
    }
    return firstSheetName;
  }

  private async getOrCreateHeaders(
    spreadsheetId: string,
    sheetName: string,
    defaultHeaders: string[],
  ): Promise<string[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${this.formatSheetRange(sheetName)}!1:1`,
    });
    const headers = (response.data.values?.[0] || []).map((header) =>
      String(header).trim(),
    );

    if (headers.length > 0) {
      return headers;
    }

    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${this.formatSheetRange(sheetName)}!1:1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [defaultHeaders],
      },
    });

    return defaultHeaders;
  }

  private normalizeHeader(header: string): string {
    const normalized = header
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    const aliases: Record<string, string> = {
      'student name': 'studentName',
      name: 'studentName',
      'hall ticket': 'hallTicketNumber',
      'hall ticket number': 'hallTicketNumber',
      hallticket: 'hallTicketNumber',
      branch: 'branch',
      'mobile number': 'mobileNumber',
      mobile: 'mobileNumber',
      phone: 'mobileNumber',
      'will attend': 'willAttend',
      attending: 'willAttend',
      'number of guests': 'numberOfGuests',
      guests: 'numberOfGuests',
      'guests allowed': 'numberOfGuests',
      'graduation day date': 'graduationDate',
      'graduation date': 'graduationDate',
      date: 'graduationDate',
      'email id': 'email',
      email: 'email',
      'reporting time': 'reportingTime',
      venue: 'venue',
      'submitted at': 'submittedAt',
      timestamp: 'submittedAt',
    };

    return aliases[normalized] || normalized.replace(/\s+/g, '');
  }

  private formatSheetRange(sheetName: string): string {
    return `'${sheetName.replace(/'/g, "''")}'`;
  }
}
