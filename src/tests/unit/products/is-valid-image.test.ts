import { describe, expect, test } from 'vitest';

import { isValidImage } from '@/features/products/upload/validation';

const makeFile = (name: string, type: string, size = 1024): File =>
  new File([new Uint8Array(size)], name, { type });

const makeFileWithoutType = (name: string, size = 1024): File =>
  new File([new Uint8Array(size)], name);

describe('isValidImage', () => {
  describe('Valid image types', () => {
    test('Should accept image/jpeg', () => {
      expect(isValidImage(makeFile('photo.jpg', 'image/jpeg'))).toBe(true);
    });

    test('Should accept image/png', () => {
      expect(isValidImage(makeFile('photo.png', 'image/png'))).toBe(true);
    });

    test('Should accept image/webp', () => {
      expect(isValidImage(makeFile('photo.webp', 'image/webp'))).toBe(true);
    });

    test('Should accept image/gif', () => {
      expect(isValidImage(makeFile('photo.gif', 'image/gif'))).toBe(true);
    });

    test('Should accept image/heic', () => {
      expect(isValidImage(makeFile('photo.heic', 'image/heic'))).toBe(true);
    });

    test('Should accept image/heif', () => {
      expect(isValidImage(makeFile('photo.heif', 'image/heif'))).toBe(true);
    });
  });

  describe('Invalid image types', () => {
    test('Should reject application/pdf', () => {
      expect(isValidImage(makeFile('doc.pdf', 'application/pdf'))).toBe(false);
    });

    test('Should reject text/plain', () => {
      expect(isValidImage(makeFile('notes.txt', 'text/plain'))).toBe(false);
    });

    test('Should reject application/zip', () => {
      expect(isValidImage(makeFile('archive.zip', 'application/zip'))).toBe(false);
    });
  });

  describe('Files without MIME type (fallback to extension)', () => {
    test('Should accept .jpg extension', () => {
      expect(isValidImage(makeFileWithoutType('photo.jpg'))).toBe(true);
    });

    test('Should accept .png extension', () => {
      expect(isValidImage(makeFileWithoutType('photo.png'))).toBe(true);
    });

    test('Should reject .pdf extension', () => {
      expect(isValidImage(makeFileWithoutType('doc.pdf'))).toBe(false);
    });

    test('Should reject .txt extension', () => {
      expect(isValidImage(makeFileWithoutType('notes.txt'))).toBe(false);
    });

    test('Should reject files with no extension', () => {
      expect(isValidImage(makeFileWithoutType('file'))).toBe(false);
    });
  });
});
