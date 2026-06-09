import { describe, expect, test } from 'vitest';

import { updateUserProfileSchema } from '@/features/profile/settings/update/validation';
import { changePasswordSchema } from '@/features/profile/settings/change-password/validation';

describe('updateUserProfileSchema', () => {
  test('Should transform email to lowercase', () => {
    const result = updateUserProfileSchema.safeParse({
      email: 'Test@Example.COM',
      username: 'testuser',
      password: 'current-pass',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});

describe('changePasswordSchema', () => {
  test('Should reject when newPassword and confirmPassword do not match', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old-pass',
      newPassword: 'new-password-1',
      confirmPassword: 'different-password',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmIssues = result.error.issues.filter(i =>
        i.path.includes('confirmPassword')
      );
      expect(confirmIssues.length).toBeGreaterThan(0);
      expect(confirmIssues[0]?.message).toContain('Passwords do not match');
    }
  });
});
