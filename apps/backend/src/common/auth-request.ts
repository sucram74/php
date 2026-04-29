export type AuthRequest = Request & { user: { userId: string; tenantId: string } };
