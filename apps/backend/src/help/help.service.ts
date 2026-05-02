import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HelpService {
  constructor(private prisma: PrismaService) {}
  async ask(tenantId: string, userId: string, message: string, sessionId?: string) {
    const m = message.toLowerCase();
    const isPlatform = /(crédito|campanha|cupom|sorteio|consumidor|compra|login|painel|tutorial|whatsapp)/i.test(message);
    const reply = isPlatform
      ? 'Claro 😊 Posso ajudar com o uso do Promo SaaS. No menu lateral, escolha a área desejada (Créditos, Campanhas, Compras, Cupons ou Sorteios).'
      : 'Agradeço a interação 😊, mas só consigo ajudar com dúvidas sobre o uso da plataforma Promo SaaS.';
    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_chat_sessions"(id text primary key, tenant_id text, user_id text, started_at timestamptz default now(), ended_at timestamptz null)`);
    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_chat_messages"(id text primary key, session_id text, tenant_id text, user_id text, question text, answer text, created_at timestamptz default now())`);
    const sid = sessionId || `s_${Date.now()}_${Math.random()}`;
    await this.prisma.$executeRawUnsafe(`INSERT INTO "help_chat_sessions"(id,tenant_id,user_id) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING`, sid, tenantId, userId);
    await this.prisma.$executeRawUnsafe(`INSERT INTO "help_chat_messages"(id,session_id,tenant_id,user_id,question,answer) VALUES ($1,$2,$3,$4,$5,$6)`, `h_${Date.now()}_${Math.random()}`, sid, tenantId, userId, m, reply);
    return { reply, sessionId: sid };
  }
  async rate(tenantId: string, userId: string, stars: number, sessionId?: string) {
    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_chat_ratings"(id text primary key, session_id text, tenant_id text, user_id text, stars int, created_at timestamptz default now())`);
    await this.prisma.$executeRawUnsafe(`INSERT INTO "help_chat_ratings"(id,session_id,tenant_id,user_id,stars) VALUES ($1,$2,$3,$4,$5)`, `r_${Date.now()}_${Math.random()}`, sessionId || null, tenantId, userId, stars);
    if (sessionId) await this.prisma.$executeRawUnsafe(`UPDATE "help_chat_sessions" SET ended_at = now() WHERE id = $1`, sessionId);
    return { ok: true };
  }
}
