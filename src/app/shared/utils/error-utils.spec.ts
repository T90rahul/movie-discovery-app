import { sanitizeError } from './error-utils';

describe('ErrorUtils', () => {
  describe('sanitizeError', () => {
    it('should handle string errors', () => {
      const result = sanitizeError('Test error message');
      expect(result).toBe('Test error message');
    });

    it('should handle Error objects', () => {
      const error = new Error('Error object message');
      const result = sanitizeError(error);
      expect(result).toBe('Error object message');
    });

    it('should handle objects with message property', () => {
      const error = { message: 'Object with message' };
      const result = sanitizeError(error);
      expect(result).toBe('Object with message');
    });

    it('should handle objects without message property', () => {
      const error = { code: 404, status: 'Not Found' };
      const result = sanitizeError(error);
      expect(result).toBe('[object Object]');
    });

    it('should handle null or undefined', () => {
      expect(sanitizeError(null)).toBe('Unknown error');
      expect(sanitizeError(undefined)).toBe('Unknown error');
    });

    it('should remove newlines and carriage returns', () => {
      const error = 'Error with\nnewlines\r\nand\rcarriage returns';
      const result = sanitizeError(error);
      expect(result).toBe('Error with newlines and carriage returns');
    });

    it('should strip ANSI escape sequences', () => {
      const error = '\u001B[31mRed error\u001B[0m';
      const result = sanitizeError(error);
      expect(result).toBe('Red error');
    });

    it('should remove non-printable ASCII characters', () => {
      const error = 'Error with \u0007bell and \u0001control characters';
      const result = sanitizeError(error);
      expect(result).toBe('Error with bell and control characters');
    });

    it('should handle complex mixed cases', () => {
      const error = '\u001B[31mError\u001B[0m with\nnewlines\r\nand \u0007special chars';
      const result = sanitizeError(error);
      expect(result).toBe('Error with newlines and special chars');
    });
  });
});