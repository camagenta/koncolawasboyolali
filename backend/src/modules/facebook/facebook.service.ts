import { Injectable } from '@nestjs/common';

interface CacheEntry {
  data: { memberCount: number; name: string } | null;
  expiresAt: number;
}

@Injectable()
export class FacebookService {
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly groupId: string;
  private readonly graphVersion = 'v22.0';
  private tokenCache: { token: string; expiresAt: number } | null = null;
  private groupCache: CacheEntry | null = null;
  private readonly cacheTtlMs = 5 * 60 * 1000; // 5 menit
  private readonly tokenTtlBuffer = 60 * 1000; // refresh 1 menit sebelum expiry

  constructor() {
    this.appId = process.env.FACEBOOK_APP_ID || '';
    this.appSecret = process.env.FACEBOOK_APP_SECRET || '';
    this.groupId = process.env.FACEBOOK_GROUP_ID || '63868647864';
  }

  get isConfigured(): boolean {
    return !!this.appId && !!this.appSecret;
  }

  private async getAppAccessToken(): Promise<string> {
    if (
      this.tokenCache &&
      Date.now() < this.tokenCache.expiresAt - this.tokenTtlBuffer
    ) {
      return this.tokenCache.token;
    }

    const url = `https://graph.facebook.com/${this.graphVersion}/oauth/access_token?client_id=${this.appId}&client_secret=${this.appSecret}&grant_type=client_credentials`;

    const res = await fetch(url);
    const data: any = await res.json();

    if (!data.access_token) {
      throw new Error(`Facebook token error: ${JSON.stringify(data)}`);
    }

    // Token default expiry 2 jam (7200s)
    const expiresIn = (data.expires_in || 7200) * 1000;
    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + expiresIn,
    };

    return data.access_token;
  }

  async getGroupStats(): Promise<{ memberCount: number; name: string } | null> {
    if (!this.isConfigured) return null;

    if (this.groupCache && Date.now() < this.groupCache.expiresAt) {
      return this.groupCache.data;
    }

    try {
      const token = await this.getAppAccessToken();
      const url = `https://graph.facebook.com/${this.graphVersion}/${this.groupId}?fields=name,member_count&access_token=${token}`;

      const res = await fetch(url);
      const data: any = await res.json();

      if (data.error) {
        console.error('Facebook Graph API error:', data.error);
        return null;
      }

      const result = {
        memberCount: data.member_count as number,
        name: data.name as string,
      };

      this.groupCache = {
        data: result,
        expiresAt: Date.now() + this.cacheTtlMs,
      };

      return result;
    } catch (err) {
      console.error('Facebook API call failed:', err);
      return null;
    }
  }
}
