import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getEmail(),
        pass: this.configService.getEmailPassword(),
      },
    });
    this.logger.log('Nodemailer Transporter configured successfully.');
  }

  async sendQueryNotification(data: {
    name: string;
    email: string;
    message: string;
  }) {
    const htmlContent = this.createQueryEmailTemplate(data);
    const recipients = this.configService.getRecipients();

    const mailOptions = {
      from: `"Graduation Day" <${this.configService.getEmail()}>`,
      to: recipients,
      subject: `🚀 New Message from ${data.name}`,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Query email sent successfully to: ${recipients}`);
  }

  private createQueryEmailTemplate(data: {
    name: string;
    email: string;
    message: string;
  }): string {
    const { name, email, message } = data;

    return `
         <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .email-container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(111, 52, 213, 0.3);
            overflow: hidden;
            position: relative;
          }

          .header {
            background: linear-gradient(135deg, #6f34d5 0%, #9b59b6 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23ffffff' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E") 0 0/50px 50px;
            animation: float 6s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .header .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 2;
          }

          .fest-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 2;
          }

          .content {
            padding: 40px 30px;
            background: #ffffff;
          }

          .intro-text {
            text-align: center;
            margin-bottom: 30px;
            font-size: 18px;
            color: #555;
            font-weight: 500;
          }

          .info-card {
            background: linear-gradient(135deg, #f8f9ff 0%, #f1f4ff 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border-left: 5px solid #6f34d5;
            box-shadow: 0 5px 15px rgba(111, 52, 213, 0.1);
          }

          .info-row {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            last-child: 0;
          }

          .info-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #6f34d5, #9b59b6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
            box-shadow: 0 3px 10px rgba(111, 52, 213, 0.3);
          }

          .info-text {
            flex: 1;
          }

          .info-label {
            font-weight: 700;
            color: #6f34d5;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }

          .info-value {
            font-size: 16px;
            color: #333;
            line-height: 1.4;
          }

          .info-value a {
            color: #6f34d5;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .info-value a:hover {
            color: #9b59b6;
            text-decoration: underline;
          }

          .message-section {
            background: linear-gradient(135deg, #6f34d5 0%, #9b59b6 100%);
            border-radius: 15px;
            padding: 25px;
            margin-top: 30px;
            position: relative;
            overflow: hidden;
          }

          .message-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cg fill-opacity='0.05'%3E%3Cpath fill='%23ffffff' d='M30 0l15 30-15 30-15-30z'/%3E%3C/g%3E%3C/svg%3E") 0 0/30px 30px;
          }

          .message-header {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
          }

          .message-content {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 2;
          }

          .message-text {
            color: #ffffff;
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
          }

          .footer {
            background: linear-gradient(135deg, #f8f9ff 0%, #f1f4ff 100%);
            text-align: center;
            padding: 30px;
            border-top: 1px solid rgba(111, 52, 213, 0.1);
          }

          .footer-text {
            color: #777;
            font-size: 14px;
            margin-bottom: 15px;
          }

          .powered-by {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #6f34d5;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .spark {
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #6f34d5, #9b59b6);
            border-radius: 3px;
            transform: rotate(45deg);
            animation: sparkle 2s ease-in-out infinite alternate;
          }

          @keyframes sparkle {
            0% { transform: rotate(45deg) scale(1); }
            100% { transform: rotate(45deg) scale(1.1); }
          }

          @media (max-width: 600px) {
            .email-container {
              margin: 10px;
              border-radius: 15px;
            }

            .header {
              padding: 30px 20px;
            }

            .header h1 {
              font-size: 24px;
            }

            .content {
              padding: 30px 20px;
            }

            .info-card {
              padding: 20px;
            }

            .info-row {
              flex-direction: column;
              align-items: flex-start;
              text-align: left;
            }

            .info-icon {
              margin-bottom: 10px;
              margin-right: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎉 New Fest Inquiry!</h1>
            <p class="subtitle">Someone's excited about your event</p>
            <div class="fest-badge">College Fest Query</div>
          </div>

          <div class="content">
            <p class="intro-text">A new inquiry has been received from your college fest website! 🚀</p>

            <div class="info-card">
              <div class="info-row">
                <div class="info-icon">👤</div>
                <div class="info-text">
                  <div class="info-label">Participant Name</div>
                  <div class="info-value">${name}</div>
                </div>
              </div>

              <div class="info-row">
                <div class="info-icon">📧</div>
                <div class="info-text">
                  <div class="info-label">Email Address</div>
                  <div class="info-value"><a href="mailto:${email}">${email}</a></div>
                </div>
              </div>
            </div>

            <div class="message-section">
              <div class="message-header">📝 Their Message</div>
              <div class="message-content">
                <p class="message-text">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <p class="footer-text">This inquiry was automatically generated from your college fest contact form.</p>
            <div class="powered-by">
              <div class="spark"></div>
              <span>College Fest Portal</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
