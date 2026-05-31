import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  }

  get isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  async sendMessage(text: string): Promise<boolean> {
    if (!this.isConfigured) return false;

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        console.error('Telegram API error:', data);
      }
      return data.ok === true;
    } catch (err) {
      console.error('Telegram send failed:', err);
      return false;
    }
  }

  escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
