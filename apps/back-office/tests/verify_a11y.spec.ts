import { test, expect } from '@playwright/test';

test('Edit Employee Modal Accessibility', async ({ page }) => {
  // 1. Mock Authentication
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN'
    }));
  });

  // 2. Mock API Responses
  await page.route('**/employees/123', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '123',
        name: 'João Silva',
        cpf: '123.456.789-00',
        registration: 'EMP001',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    });
  });

  await page.route('**/contracts?**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  await page.route('**/documents', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  // 3. Navigate to the page
  // Note: Localhost port might vary, usually 5173 for Vite
  await page.goto('http://localhost:5173/funcionarios/123');

  // 4. Verify page loaded
  await expect(page.getByText('João Silva')).toBeVisible();

  // 5. Open Edit Modal
  await page.getByRole('button', { name: 'Editar' }).click();

  // 6. Verify Modal Accessibility
  const modal = page.getByRole('dialog', { name: 'Editar Informações' });
  await expect(modal).toBeVisible();

  // Verify label-input association
  // This confirms that clicking the text label focuses the input, which only works if htmlFor/id are correct
  const nameLabel = page.locator('label', { hasText: 'Nome Completo' });
  await nameLabel.click();

  // We check if the input associated with the label is focused.
  // Playwright's getByLabel relies on accessibility tree, so if this works, a11y is good.
  await expect(page.getByLabel('Nome Completo')).toBeFocused();

  // Verify close button has accessible name
  const closeButton = page.getByRole('button', { name: 'Fechar' });
  await expect(closeButton).toBeVisible();

  // 7. Take screenshot
  await page.screenshot({ path: 'apps/back-office/tests/accessibility-check.png' });
});
