import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    mockLocalStorage = {};

    // Mock completo de localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    service = new StorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return null when key does not exist', () => {
      expect(service.get('nonexistent')).toBeNull();
    });

    it('should return parsed value when key exists', () => {
      const testData = { name: 'John', age: 30 };
      mockLocalStorage['testKey'] = JSON.stringify(testData);

      expect(service.get('testKey')).toEqual(testData);
    });

    it('should return null and log error when JSON parsing fails', () => {
      mockLocalStorage['invalidJson'] = 'invalid{json}';
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(service.get('invalidJson')).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error parsing localStorage key'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle typed returns correctly', () => {
      interface User {
        name: string;
        age: number;
      }

      const user: User = { name: 'Jane', age: 25 };
      mockLocalStorage['user'] = JSON.stringify(user);

      const result = service.get<User>('user');
      expect(result).toEqual(user);
      expect(result?.name).toBe('Jane');
    });
  });

  describe('set', () => {
    it('should store value as JSON', () => {
      const testData = { name: 'Alice', role: 'Admin' };
      service.set('userData', testData);

      expect(mockLocalStorage['userData']).toBe(JSON.stringify(testData));
    });

    it('should handle storage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Simular error de storage
      (window.localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      service.set('key', 'value');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error setting localStorage key'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should remove item from storage', () => {
      mockLocalStorage['testKey'] = 'testValue';
      service.remove('testKey');

      expect(mockLocalStorage['testKey']).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear all items from storage', () => {
      mockLocalStorage['key1'] = 'value1';
      mockLocalStorage['key2'] = 'value2';

      service.clear();

      expect(Object.keys(mockLocalStorage).length).toBe(0);
    });
  });
});
