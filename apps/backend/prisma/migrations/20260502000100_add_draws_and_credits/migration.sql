-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "drawn_at" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "seed" TEXT NOT NULL,
    "seed_hash" TEXT NOT NULL,
    "created_by_user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrawWinner" (
    "id" TEXT NOT NULL,
    "draw_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "consumer_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DrawWinner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantCredit" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "pix_key" TEXT,
    "pix_qr_code" TEXT,
    "pix_copy_paste" TEXT,
    "package_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Draw_tenant_id_idx" ON "Draw"("tenant_id");
CREATE INDEX "Draw_campaign_id_idx" ON "Draw"("campaign_id");
CREATE INDEX "DrawWinner_draw_id_idx" ON "DrawWinner"("draw_id");
CREATE UNIQUE INDEX "TenantCredit_tenant_id_key" ON "TenantCredit"("tenant_id");
CREATE INDEX "CreditTransaction_tenant_id_idx" ON "CreditTransaction"("tenant_id");

-- AddForeignKey
ALTER TABLE "Draw" ADD CONSTRAINT "Draw_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Draw" ADD CONSTRAINT "Draw_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DrawWinner" ADD CONSTRAINT "DrawWinner_draw_id_fkey" FOREIGN KEY ("draw_id") REFERENCES "Draw"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DrawWinner" ADD CONSTRAINT "DrawWinner_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DrawWinner" ADD CONSTRAINT "DrawWinner_consumer_id_fkey" FOREIGN KEY ("consumer_id") REFERENCES "Consumer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TenantCredit" ADD CONSTRAINT "TenantCredit_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
