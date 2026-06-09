import { describe, expect, test } from 'vitest';
import z from 'zod';

import { getFieldErrorsFromTree } from '@/utils/validation-errors';

const testSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

const singleFieldSchema = z.object({
  username: z.string().min(5, 'Too short').max(10, 'Too long'),
});

describe('getFieldErrorsFromTree', () => {
  describe('Valid data', () => {
    test('Should return empty object when there are no errors', () => {
      const result = testSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        age: 25,
      });

      expect(result.success).toBe(true);

      if (!result.success) {
        const errors = getFieldErrorsFromTree(result.error);
        expect(errors).toEqual({});
      }
    });
  });

  describe('Single field errors', () => {
    test('Should extract error for a single invalid field', () => {
      const result = testSchema.safeParse({
        name: 'Jo',
        email: 'john@example.com',
        age: 25,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = getFieldErrorsFromTree(result.error);
        expect(errors).toHaveProperty('name');
        expect(errors.name).toContain('Name must be at least 3 characters');
      }
    });

    test('Should extract error for invalid email', () => {
      const result = testSchema.safeParse({
        name: 'John',
        email: 'not-an-email',
        age: 25,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = getFieldErrorsFromTree(result.error);
        expect(errors).toHaveProperty('email');
        expect(errors.email?.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Multiple field errors', () => {
    test('Should extract errors for multiple invalid fields', () => {
      const result = testSchema.safeParse({
        name: 'Jo',
        email: 'invalid',
        age: 15,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = getFieldErrorsFromTree(result.error);
        expect(errors).toHaveProperty('name');
        expect(errors).toHaveProperty('email');
        expect(errors).toHaveProperty('age');
      }
    });
  });

  describe('Multiple errors per field', () => {
    test('Should extract all errors for a field with multiple constraints', () => {
      const result = singleFieldSchema.safeParse({
        username: 'ab',
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = getFieldErrorsFromTree(result.error);
        expect(errors).toHaveProperty('username');
      }
    });
  });

  describe('Unknown schema shape', () => {
    test('Should not throw when tree has unexpected structure', () => {
      const nestedSchema = z.object({
        tags: z.array(z.string()).min(1, 'At least one tag required'),
      });

      const result = nestedSchema.safeParse({ tags: [] });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(() => getFieldErrorsFromTree(result.error)).not.toThrow();
      }
    });
  });
});
