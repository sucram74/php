import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type Confidence = 'high' | 'medium' | 'low';

@Injectable()
export class HelpService {
  constructor(private prisma: PrismaService) {}

  private normalize(text: string) {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private stemToken(token: string) {
    let stem = token;
    if (stem.endsWith('coes')) stem = `${stem.slice(0, -4)}cao`;
    else if (stem.endsWith('cao')) stem = `${stem.slice(0, -3)}ca`;
    else if (stem.endsWith('oes')) stem = stem.slice(0, -3);
    else if (stem.endsWith('s') && stem.length > 3) stem = stem.slice(0, -1);

    if (stem.endsWith('ando') || stem.endsWith('endo') || stem.endsWith('indo')) stem = stem.slice(0, -4);
    if (stem.endsWith('ar') || stem.endsWith('er') || stem.endsWith('ir')) stem = stem.slice(0, -2);
    if (stem.endsWith('ura') || stem.endsWith('ino')) stem = stem.slice(0, -3);

    return stem;
  }

  private tokenize(text: string) {
    return this.normalize(text)
      .split(' ')
      .filter(Boolean)
      .map((token) => this.stemToken(token));
  }

  private async ensureTables() {
    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_knowledge_base"(
      id text primary key,
      category text not null,
      title text not null,
      "questionPattern" text not null,
      keywords text[] not null default '{}',
      answer text not null,
      priority int not null default 0,
      active boolean not null default true,
      "createdAt" timestamptz default now(),
      "updatedAt" timestamptz default now()
    )`);

    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_unanswered_questions"(
      id text primary key,
      "tenantId" text,
      "userId" text,
      question text not null,
      "normalizedQuestion" text not null,
      "createdAt" timestamptz default now(),
      resolved boolean default false,
      notes text
    )`);

    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_chat_sessions"(id text primary key, tenant_id text, user_id text, started_at timestamptz default now(), ended_at timestamptz null)`);
    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_chat_messages"(id text primary key, session_id text, tenant_id text, user_id text, question text, answer text, confidence text, created_at timestamptz default now())`);
    await this.prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "help_chat_ratings"(id text primary key, session_id text, tenant_id text, user_id text, stars int, created_at timestamptz default now())`);
  }

  private async seedKnowledgeBase() {
    const count: Array<{ count: bigint }> = await this.prisma.$queryRawUnsafe('SELECT COUNT(*)::bigint as count FROM "help_knowledge_base"');

    const rows = [
      ['Comercial','Como assinar?','assinar|assino|assinatura|plano|planos|contratar|contrato|plataforma|comecar|gratis|gratuito|preco|pago',"Você pode começar clicando em 'Começar grátis' 😊. Depois crie sua conta, ganhe sua primeira campanha gratuita e escolha um pacote de créditos quando desejar.",['assinar','assino','assinatura','plano','planos','contratar','contrato','plataforma','comecar','gratis','gratuito','preco','pago'],100],
      ['Comercial','Existe suporte?','suporte|atendimento|ajuda','Sim 😊. Você pode acionar o suporte pela própria plataforma ou pelo canal informado pela loja/administração.',['suporte','atendimento','ajuda'],95],
      ['Infraestrutura','A plataforma funciona 24 horas?','24 horas|disponibilidade|online','Sim 😊. A proposta da plataforma é funcionar online, 24 horas por dia. A disponibilidade final depende do ambiente de hospedagem.',['24 horas','online','nuvem'],98],
      ['Produto','Como criar campanha?','criar campanha|campanha','No menu Campanhas, clique em criar, informe regras, período e valor mínimo por cupom para ativar.',['campanha','cupom'],90],
      ['Operacional','Como comprar créditos?','comprar creditos|pix|credito','No menu lateral, clique em Créditos, escolha um pacote, confirme a compra e faça o pagamento via Pix. Depois clique em "Já paguei" para análise 😊.',['creditos','pix','pacote'],97],
      ['Admin','Como funciona o Painel Marcus?','painel marcus|admin|aprovar creditos','No Painel Marcus, o admin acompanha lojas, aprova créditos e monitora campanhas, consumidores e indicadores.',['marcus','admin','aprovar'],92],
      ['Segurança','Como funciona LGPD?','lgpd|privacidade|dados','A plataforma aplica controle de acesso por perfil e tenant, preservando privacidade e uso de dados conforme políticas da operação.',['lgpd','dados','privacidade'],88],
      ['Produto','Como registrar compra?','registrar compra|compra','No menu Compras, selecione consumidor e campanha, informe valor e data. O sistema gera cupons conforme a regra.',['compra','cupons'],89],
    ];

    if ((count[0]?.count || 0n) === 0n) {
      for (const r of rows) {
      await this.prisma.$executeRawUnsafe(
        'INSERT INTO "help_knowledge_base"(id,category,title,"questionPattern",keywords,answer,priority,active) VALUES ($1,$2,$3,$4,$5,$6,$7,true)',
        `kb_${Date.now()}_${Math.random()}`,
        r[0], r[1], r[2], r[4], r[3], r[5],
      );
      }
    }

    await this.prisma.$executeRawUnsafe(
      'UPDATE "help_knowledge_base" SET keywords = $1, "questionPattern" = $2, answer = $3 WHERE category = $4 AND title = $5',
      ['assinar','assino','assinatura','plano','planos','contratar','contrato','plataforma','comecar','gratis','gratuito','preco','pago'],
      'assinar|assino|assinatura|plano|planos|contratar|contrato|plataforma|comecar|gratis|gratuito|preco|pago',
      "Você pode começar clicando em 'Começar grátis' 😊. Depois crie sua conta, ganhe sua primeira campanha gratuita e escolha um pacote de créditos quando desejar.",
      'Comercial',
      'Como assinar?',
    );
  }

  private async findBestAnswer(message: string) {

    const normalized = this.normalize(message);
    const normalizedTokens = this.tokenize(message);
    const kb: Array<{ category: string; title: string; answer: string; keywords: string[]; questionPattern: string; priority: number }> =
      await this.prisma.$queryRawUnsafe('SELECT category,title,answer,keywords,"questionPattern",priority FROM "help_knowledge_base" WHERE active=true ORDER BY priority DESC');

    let best: any = null;
    let score = 0;
    for (const item of kb) {
      let s = 0;
      const keywordStems = (item.keywords || []).map((kw) => this.stemToken(this.normalize(kw)));
            for (const kwStem of keywordStems) if (kwStem.length >= 3 && normalizedTokens.some((token) => token.startsWith(kwStem))) s += 3;
      if (new RegExp(item.questionPattern, 'i').test(normalized)) s += 4;

      const commercialIntent = normalizedTokens.some((token) => ['assin','contrat'].some((root) => token.startsWith(root)));
      const commercialContext = normalizedTokens.some((token) => ['plan','plataform','prec','pag','grat','comec'].some((root) => token.startsWith(root)));
      if (item.category === 'Comercial' && commercialIntent && commercialContext) s += 8;
      if (s > score) {
        score = s;
        best = item;
      }
    }

    const confidence: Confidence = score >= 6 ? 'high' : score >= 3 ? 'medium' : 'low';
    return { best, confidence, normalized };
  }

  async ask(tenantId: string, userId: string, message: string, sessionId?: string) {
    await this.ensureTables();
    await this.seedKnowledgeBase();

    const { best, confidence, normalized } = await this.findBestAnswer(message);
    let reply = 'Posso não ter entendido perfeitamente 😊. Você poderia reformular sua pergunta sobre a plataforma?';

    if (confidence === 'high' && best) reply = best.answer;
    if (confidence === 'medium' && best) reply = `${best.answer} Se não era isso que você queria, me diga com outras palavras 😊.`;
    if (confidence === 'low') {
      await this.prisma.$executeRawUnsafe(
        'INSERT INTO "help_unanswered_questions"(id,"tenantId","userId",question,"normalizedQuestion",resolved) VALUES ($1,$2,$3,$4,$5,false)',
        `uq_${Date.now()}_${Math.random()}`,
        tenantId,
        userId,
        message,
        normalized,
      );
    }

    const sid = sessionId || `s_${Date.now()}_${Math.random()}`;
    await this.prisma.$executeRawUnsafe('INSERT INTO "help_chat_sessions"(id,tenant_id,user_id) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING', sid, tenantId, userId);
    await this.prisma.$executeRawUnsafe('INSERT INTO "help_chat_messages"(id,session_id,tenant_id,user_id,question,answer,confidence) VALUES ($1,$2,$3,$4,$5,$6,$7)', `h_${Date.now()}_${Math.random()}`, sid, tenantId, userId, message, reply, confidence);

    return { reply, sessionId: sid, confidence };
  }

  async rate(tenantId: string, userId: string, stars: number, sessionId?: string) {
    await this.ensureTables();
    await this.prisma.$executeRawUnsafe('INSERT INTO "help_chat_ratings"(id,session_id,tenant_id,user_id,stars) VALUES ($1,$2,$3,$4,$5)', `r_${Date.now()}_${Math.random()}`, sessionId || null, tenantId, userId, stars);
    if (sessionId) await this.prisma.$executeRawUnsafe('UPDATE "help_chat_sessions" SET ended_at = now() WHERE id = $1', sessionId);
    return { ok: true };
  }
  async adminInsights() {
    await this.ensureTables();
    const unanswered = await this.prisma.$queryRawUnsafe('SELECT question, "createdAt" FROM "help_unanswered_questions" ORDER BY "createdAt" DESC LIMIT 50');
    const topQuestions = await this.prisma.$queryRawUnsafe('SELECT "normalizedQuestion", COUNT(*)::int as total FROM "help_unanswered_questions" GROUP BY "normalizedQuestion" ORDER BY total DESC LIMIT 10');
    const ratings = await this.prisma.$queryRawUnsafe('SELECT stars, COUNT(*)::int as total FROM "help_chat_ratings" GROUP BY stars ORDER BY stars DESC');
    const sessions = await this.prisma.$queryRawUnsafe('SELECT id, tenant_id, user_id, started_at, ended_at FROM "help_chat_sessions" ORDER BY started_at DESC LIMIT 20');
    return { unanswered, topQuestions, ratings, sessions };
  }

}
