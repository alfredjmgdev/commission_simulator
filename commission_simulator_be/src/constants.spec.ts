import { PORT, SERVICE_NAME, CORS_CONFIG } from './constants';

describe('Constants', () => {
  describe('PORT', () => {
    it('should be defined', () => {
      expect(PORT).toBeDefined();
    });

    it('should be a number', () => {
      expect(typeof PORT).toBe('number');
    });

    it('should be 3001', () => {
      expect(PORT).toBe(3001);
    });
  });

  describe('SERVICE_NAME', () => {
    it('should be defined', () => {
      expect(SERVICE_NAME).toBeDefined();
    });

    it('should be a string', () => {
      expect(typeof SERVICE_NAME).toBe('string');
    });

    it('should be "Commission Simulator BE"', () => {
      expect(SERVICE_NAME).toBe('Commission Simulator BE');
    });

    it('should not be empty', () => {
      expect(SERVICE_NAME.length).toBeGreaterThan(0);
    });
  });

  describe('CORS_CONFIG', () => {
    it('should be defined', () => {
      expect(CORS_CONFIG).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof CORS_CONFIG).toBe('object');
    });

    it('should have methods property', () => {
      expect(CORS_CONFIG).toHaveProperty('methods');
    });

    it('should have origin property', () => {
      expect(CORS_CONFIG).toHaveProperty('origin');
    });

    it('should have credentials property', () => {
      expect(CORS_CONFIG).toHaveProperty('credentials');
    });

    describe('methods property', () => {
      it('should be an array', () => {
        expect(Array.isArray(CORS_CONFIG.methods)).toBe(true);
      });

      it('should contain GET method', () => {
        expect(CORS_CONFIG.methods).toContain('GET');
      });

      it('should contain POST method', () => {
        expect(CORS_CONFIG.methods).toContain('POST');
      });

      it('should contain PUT method', () => {
        expect(CORS_CONFIG.methods).toContain('PUT');
      });

      it('should contain DELETE method', () => {
        expect(CORS_CONFIG.methods).toContain('DELETE');
      });

      it('should contain OPTIONS method', () => {
        expect(CORS_CONFIG.methods).toContain('OPTIONS');
      });

      it('should have exactly 5 methods', () => {
        expect(CORS_CONFIG.methods.length).toBe(5);
      });

      it('should have the correct methods in the expected order', () => {
        expect(CORS_CONFIG.methods).toEqual([
          'GET',
          'POST',
          'PUT',
          'DELETE',
          'OPTIONS',
        ]);
      });
    });

    describe('origin property', () => {
      it('should be a string', () => {
        expect(typeof CORS_CONFIG.origin).toBe('string');
      });

      it('should be "*"', () => {
        expect(CORS_CONFIG.origin).toBe('*');
      });
    });

    describe('credentials property', () => {
      it('should be a boolean', () => {
        expect(typeof CORS_CONFIG.credentials).toBe('boolean');
      });

      it('should be true', () => {
        expect(CORS_CONFIG.credentials).toBe(true);
      });
    });

    it('should have the expected structure', () => {
      expect(CORS_CONFIG).toEqual({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        origin: '*',
        credentials: true,
      });
    });

    it('should not have additional properties', () => {
      const corsConfigKeys = Object.keys(CORS_CONFIG);
      expect(corsConfigKeys).toHaveLength(3);
      expect(corsConfigKeys).toEqual(['methods', 'origin', 'credentials']);
    });
  });
});
