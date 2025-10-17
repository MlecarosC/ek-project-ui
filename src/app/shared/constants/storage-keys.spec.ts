import { STORAGE_KEYS, AVATAR_IMAGES } from './storage-keys';

describe('storage-keys', () => {
  describe('STORAGE_KEYS', () => {
    it('should have AVATAR_CACHE key', () => {
      expect(STORAGE_KEYS.AVATAR_CACHE).toBe('candidatos-avatars');
    });

    it('should have CURRENT_PAGE key', () => {
      expect(STORAGE_KEYS.CURRENT_PAGE).toBe('candidatos-current-page');
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(STORAGE_KEYS);
      expect(keys).toContain('AVATAR_CACHE');
      expect(keys).toContain('CURRENT_PAGE');
      expect(keys.length).toBe(2);
    });

    it('should have correct structure', () => {
      expect(STORAGE_KEYS).toEqual({
        AVATAR_CACHE: 'candidatos-avatars',
        CURRENT_PAGE: 'candidatos-current-page',
      });
    });

    it('should have string values', () => {
      expect(typeof STORAGE_KEYS.AVATAR_CACHE).toBe('string');
      expect(typeof STORAGE_KEYS.CURRENT_PAGE).toBe('string');
    });
  });

  describe('AVATAR_IMAGES', () => {
    it('should have 4 avatar URLs', () => {
      expect(AVATAR_IMAGES.length).toBe(4);
    });

    it('should have valid HTTPS URLs', () => {
      AVATAR_IMAGES.forEach(url => {
        expect(url).toMatch(/^https:\/\//);
        expect(url).toContain('daisyui.com');
        expect(url).toContain('profile/demo');
      });
    });

    it('should have unique URLs', () => {
      const uniqueUrls = new Set(AVATAR_IMAGES);
      expect(uniqueUrls.size).toBe(AVATAR_IMAGES.length);
    });

    it('should contain all expected URLs', () => {
      expect(AVATAR_IMAGES).toEqual([
        'https://img.daisyui.com/images/profile/demo/2@94.webp',
        'https://img.daisyui.com/images/profile/demo/3@94.webp',
        'https://img.daisyui.com/images/profile/demo/4@94.webp',
        'https://img.daisyui.com/images/profile/demo/5@94.webp'
      ]);
    });

    it('should have webp format', () => {
      AVATAR_IMAGES.forEach(url => {
        expect(url).toMatch(/\.webp$/);
      });
    });

    it('should be array of strings', () => {
      AVATAR_IMAGES.forEach(url => {
        expect(typeof url).toBe('string');
      });
    });

    it('should have sequential demo numbers', () => {
      const numbers = AVATAR_IMAGES.map(url => {
        const match = url.match(/demo\/(\d+)@/);
        return match ? parseInt(match[1]) : 0;
      });
      expect(numbers).toEqual([2, 3, 4, 5]);
    });
  });

  describe('Type Safety', () => {
    it('should infer correct types', () => {
      // Test que verifica que TypeScript infiere los tipos correctamente
      const key: string = STORAGE_KEYS.AVATAR_CACHE;
      const url: string = AVATAR_IMAGES[0];
      
      expect(key).toBeTruthy();
      expect(url).toBeTruthy();
    });

    it('should have readonly tuple type for AVATAR_IMAGES', () => {
      // Verificar que es un array con exactamente 4 elementos
      expect(AVATAR_IMAGES.length).toBe(4);
      
      // Intentar modificar no debería compilar en TypeScript
      // pero en runtime JavaScript lo permite (por eso no testeamos eso)
      const copy = [...AVATAR_IMAGES];
      expect(copy).toEqual(AVATAR_IMAGES);
    });
  });
});
