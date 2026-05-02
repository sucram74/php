CREATE TABLE IF NOT EXISTS "help_knowledge_base" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questionPattern" TEXT NOT NULL,
    "keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "answer" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "help_knowledge_base_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "help_unanswered_questions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "userId" TEXT,
    "question" TEXT NOT NULL,
    "normalizedQuestion" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    CONSTRAINT "help_unanswered_questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "help_chat_sessions" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "user_id" TEXT,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ,
    CONSTRAINT "help_chat_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "help_chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "tenant_id" TEXT,
    "user_id" TEXT,
    "question" TEXT,
    "answer" TEXT,
    "confidence" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "help_chat_messages_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "help_chat_messages"
    ADD COLUMN IF NOT EXISTS "confidence" TEXT;

CREATE TABLE IF NOT EXISTS "help_chat_ratings" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "tenant_id" TEXT,
    "user_id" TEXT,
    "stars" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "help_chat_ratings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "help_chat_messages_session_id_idx" ON "help_chat_messages"("session_id");
CREATE INDEX IF NOT EXISTS "help_chat_ratings_session_id_idx" ON "help_chat_ratings"("session_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'help_chat_messages_session_id_fkey'
    ) THEN
        ALTER TABLE "help_chat_messages"
        ADD CONSTRAINT "help_chat_messages_session_id_fkey"
        FOREIGN KEY ("session_id") REFERENCES "help_chat_sessions"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'help_chat_ratings_session_id_fkey'
    ) THEN
        ALTER TABLE "help_chat_ratings"
        ADD CONSTRAINT "help_chat_ratings_session_id_fkey"
        FOREIGN KEY ("session_id") REFERENCES "help_chat_sessions"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
