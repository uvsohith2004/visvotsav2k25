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
      range: `${sheetName}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
  }
}
