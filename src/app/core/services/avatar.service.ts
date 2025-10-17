import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS, AVATAR_IMAGES } from '../../shared/constants/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private storage = inject(StorageService);

  getAvatarMap(): Map<number, string> {
    const saved = this.storage.get<Record<number, string>>(STORAGE_KEYS.AVATAR_CACHE);
    if (!saved) return new Map();
    
    return new Map(Object.entries(saved).map(([k, v]) => [Number(k), v]));
  }

  getOrAssignAvatar(candidatoId: number, existingMap: Map<number, string>): string {
    if (existingMap.has(candidatoId)) {
      return existingMap.get(candidatoId)!;
    }
    return this.getRandomAvatar();
  }

  saveAvatars(candidatos: Array<{ id: number; avatarUrl: string }>): void {
    const avatarMap = candidatos.reduce((acc, { id, avatarUrl }) => {
      acc[id] = avatarUrl;
      return acc;
    }, {} as Record<number, string>);
    
    this.storage.set(STORAGE_KEYS.AVATAR_CACHE, avatarMap);
  }

  private getRandomAvatar(): string {
    return AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)];
  }
}
