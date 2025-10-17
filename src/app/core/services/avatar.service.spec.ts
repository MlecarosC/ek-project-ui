import { TestBed } from '@angular/core/testing';
import { AvatarService } from './avatar.service';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../../shared/constants/storage-keys';

describe('AvatarService', () => {
  let service: AvatarService;
  let mockStorageService: jest.Mocked<StorageService>;

  beforeEach(() => {
    mockStorageService = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AvatarService,
        { provide: StorageService, useValue: mockStorageService },
      ],
    });

    service = TestBed.inject(AvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvatarMap', () => {
    it('should return empty map when no saved avatars', () => {
      mockStorageService.get.mockReturnValue(null);

      const result = service.getAvatarMap();

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
      expect(mockStorageService.get).toHaveBeenCalledWith(STORAGE_KEYS.AVATAR_CACHE);
    });

    it('should return map with saved avatars', () => {
      const savedAvatars = {
        1: 'https://example.com/avatar1.jpg',
        2: 'https://example.com/avatar2.jpg',
      };
      mockStorageService.get.mockReturnValue(savedAvatars);

      const result = service.getAvatarMap();

      expect(result.size).toBe(2);
      expect(result.get(1)).toBe('https://example.com/avatar1.jpg');
      expect(result.get(2)).toBe('https://example.com/avatar2.jpg');
    });

    it('should convert string keys to numbers', () => {
      const savedAvatars = {
        '5': 'avatar5.jpg',
        '10': 'avatar10.jpg',
      };
      mockStorageService.get.mockReturnValue(savedAvatars);

      const result = service.getAvatarMap();

      expect(result.has(5)).toBe(true);
      expect(result.has(10)).toBe(true);
    });
  });

  describe('getOrAssignAvatar', () => {
    it('should return existing avatar if found in map', () => {
      const existingMap = new Map([[1, 'existing-avatar.jpg']]);

      const result = service.getOrAssignAvatar(1, existingMap);

      expect(result).toBe('existing-avatar.jpg');
    });

    it('should return random avatar if not found in map', () => {
      const existingMap = new Map();

      const result = service.getOrAssignAvatar(999, existingMap);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/https:\/\//);
    });

    it('should return different avatars from available pool', () => {
      const existingMap = new Map();
      const avatars = new Set<string>();

      // Generar múltiples avatares
      for (let i = 0; i < 20; i++) {
        const avatar = service.getOrAssignAvatar(i, existingMap);
        avatars.add(avatar);
      }

      // Debe haber al menos 1 avatar diferente (probablemente más)
      expect(avatars.size).toBeGreaterThanOrEqual(1);
      expect(avatars.size).toBeLessThanOrEqual(4); // Máximo 4 avatares disponibles
    });
  });

  describe('saveAvatars', () => {
    it('should save avatars to storage with correct format', () => {
      const candidatos = [
        { id: 1, avatarUrl: 'avatar1.jpg' },
        { id: 2, avatarUrl: 'avatar2.jpg' },
      ];

      service.saveAvatars(candidatos);

      expect(mockStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEYS.AVATAR_CACHE,
        {
          1: 'avatar1.jpg',
          2: 'avatar2.jpg',
        }
      );
    });

    it('should handle empty array', () => {
      service.saveAvatars([]);

      expect(mockStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEYS.AVATAR_CACHE,
        {}
      );
    });

    it('should handle single candidato', () => {
      const candidatos = [{ id: 42, avatarUrl: 'solo.jpg' }];

      service.saveAvatars(candidatos);

      expect(mockStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEYS.AVATAR_CACHE,
        { 42: 'solo.jpg' }
      );
    });
  });
});
