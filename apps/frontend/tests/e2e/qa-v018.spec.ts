import { expect, test } from '@playwright/test';

const storeCreds = { email: 'store@demo.com', password: 'store123' };
const adminCreds = { email: 'admin@demo.com', password: 'admin123' };

async function login(page: any, creds: { email: string; password: string }) {
  await page.goto('/login');
  await page.locator('input').nth(0).fill(creds.email);
  await page.locator('input').nth(1).fill(creds.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

test('rotas públicas e proteção sem login', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Começar grátis' })).toBeVisible();

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Painel da Loja')).toHaveCount(0);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);

  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login/);
});

test('acesso loja e bloqueio admin', async ({ page }) => {
  await login(page, storeCreds);
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('Painel da Loja')).toBeVisible();
  await expect(page.getByText('Painel Marcus')).toHaveCount(0);

  await page.goto('/admin');
  await expect(page).toHaveURL(/\/dashboard/);
});

test('acesso admin e bot responde perguntas-chave', async ({ page }) => {
  await login(page, adminCreds);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Painel Marcus' })).toBeVisible();

  const prompts = [
    { q: 'Como faço para assinar?', expected: /Começar grátis|primeira campanha gratuita/i },
    { q: 'Existe suporte?', expected: /Você pode acionar o suporte|suporte/i },
    { q: 'Essa plataforma funciona 24 horas?', expected: /24 horas|funcionar online/i },
    { q: 'Como compro créditos?', expected: /menu lateral|Créditos|Pix/i },
    { q: 'Você é gostosa?', expected: /Posso não ter entendido|reformular|plataforma/i },
  ];

  for (const p of prompts) {
    await page.getByPlaceholder('Digite sua dúvida...').fill(p.q);
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.getByText(p.expected)).toBeVisible();
  }
});
