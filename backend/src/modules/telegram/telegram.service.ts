import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class TelegramService implements OnApplicationBootstrap {
  private readonly botToken: string;
  private readonly apiUrl: string;

  constructor(private readonly prisma: PrismaService) {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async onApplicationBootstrap() {
    const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID;
    if (ownerChatId) {
      const existing = await this.prisma.notificationRecipient.findUnique({
        where: { chatId: ownerChatId },
      });
      if (!existing) {
        await this.prisma.notificationRecipient.create({
          data: { chatId: ownerChatId, label: 'Owner' },
        });
        console.log(`Telegram: owner ${ownerChatId} seeded as recipient`);
      }
    }
  }

  get isConfigured(): boolean {
    return !!this.botToken;
  }

  async notifyAll(text: string): Promise<void> {
    if (!this.isConfigured) return;

    const recipients = await this.prisma.notificationRecipient.findMany({
      where: { isActive: true },
    });

    await Promise.allSettled(
      recipients.map(r => this.sendTo(r.chatId, text)),
    );
  }

  async sendTo(chatId: string, text: string): Promise<boolean> {
    if (!this.isConfigured) return false;

    try {
      const res = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: Number(chatId),
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

  async handleWebhook(body: any): Promise<string> {
    const message = body.message;
    if (!message || !message.text) return 'ok';

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const fromUsername = message.from?.username || '';
    const fromName = `${message.from?.first_name || ''} ${message.from?.last_name || ''}`.trim();

    if (!text.startsWith('/')) return 'ok';

    const ownerChatId = process.env.TELEGRAM_OWNER_CHAT_ID || '';
    const isOwner = chatId === ownerChatId;

    if (text.startsWith('/start') || text.startsWith('/help')) {
      const ownerInfo = ownerChatId
        ? `Owner chat ID: ${ownerChatId}`
        : 'Owner belum diset (TELEGRAM_OWNER_CHAT_ID)';
      await this.sendTo(chatId,
        `<b>🤖 KoncoLawas Bot</b>\n\n` +
        `Notifikasi aktivitas alumni.\n\n` +
        `<b>Perintah (owner only):</b>\n` +
        `/addnotif &lt;chatId&gt; — tambah penerima notifikasi\n` +
        `/addnotif &lt;chatId&gt; &lt;label&gt; — tambah dengan label\n` +
        `/removenotif &lt;chatId&gt; — hapus penerima\n` +
        `/listnotif — daftar semua penerima\n\n` +
        `<code>${ownerInfo}</code>`
      );
      return 'ok';
    }

    if (!isOwner) {
      await this.sendTo(chatId, 'Maaf, kamu belum terdaftar sebagai owner bot.');
      return 'ok';
    }

    if (text.startsWith('/addnotif')) {
      const parts = text.split(' ').slice(1);
      if (parts.length === 0) {
        await this.sendTo(chatId, 'Gunakan: /addnotif &lt;chatId&gt; [label]');
        return 'ok';
      }
      const targetChatId = parts[0];
      const label = parts.slice(1).join(' ') || null;

      const existing = await this.prisma.notificationRecipient.findUnique({
        where: { chatId: targetChatId },
      });

      if (existing) {
        await this.prisma.notificationRecipient.update({
          where: { chatId: targetChatId },
          data: { isActive: true, label: label || existing.label },
        });
        await this.sendTo(chatId, `✅ ${targetChatId} sudah aktif kembali.`);
      } else {
        await this.prisma.notificationRecipient.create({
          data: { chatId: targetChatId, label },
        });
        await this.sendTo(chatId, `✅ ${targetChatId} (${label || 'tanpa label'}) ditambahkan!`);
      }
      return 'ok';
    }

    if (text.startsWith('/removenotif')) {
      const targetChatId = text.split(' ')[1];
      if (!targetChatId) {
        await this.sendTo(chatId, 'Gunakan: /removenotif &lt;chatId&gt;');
        return 'ok';
      }
      await this.prisma.notificationRecipient.updateMany({
        where: { chatId: targetChatId },
        data: { isActive: false },
      });
      await this.sendTo(chatId, `✅ ${targetChatId} dinonaktifkan.`);
      return 'ok';
    }

    if (text.startsWith('/listnotif')) {
      const recipients = await this.prisma.notificationRecipient.findMany({
        orderBy: { createdAt: 'asc' },
      });
      if (recipients.length === 0) {
        await this.sendTo(chatId, 'Belum ada penerima notifikasi.');
        return 'ok';
      }
      let msg = '<b>📋 Daftar Penerima Notifikasi:</b>\n\n';
      for (const r of recipients) {
        msg += `${r.isActive ? '🟢' : '🔴'} <code>${r.chatId}</code>`;
        if (r.label) msg += ` — ${this.escape(r.label)}`;
        msg += '\n';
      }
      await this.sendTo(chatId, msg);
      return 'ok';
    }

    return 'ok';
  }

  escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
