import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjuntoService } from '../../core/services/adjunto.service';
import { CandidatoView } from '../../shared/models/candidato-view.model';

@Component({
  selector: 'app-candidatos',
  imports: [CommonModule],
  templateUrl: './candidatos.component.html',
})
export class CandidatosComponent implements OnInit {
  candidatos: CandidatoView[] = [];
  loading = true;
  error = '';
  
  // Control de filas expandidas
  expandedRows = new Set<number>();

  private readonly AVATAR_CACHE_KEY = 'candidatos-avatars';
  private avatarImages = [
    'https://img.daisyui.com/images/profile/demo/2@94.webp',
    'https://img.daisyui.com/images/profile/demo/3@94.webp',
    'https://img.daisyui.com/images/profile/demo/4@94.webp',
    'https://img.daisyui.com/images/profile/demo/5@94.webp'
  ];

  constructor(private adjuntoService: AdjuntoService) {}

  ngOnInit(): void {
    this.loadCandidatos();
  }

  loadCandidatos(): void {
    this.adjuntoService.getAllCandidatosConAdjuntos().subscribe({
      next: (data) => {
        const savedAvatars = this.getSavedAvatars();
        
        this.candidatos = data.map(item => ({
          ...item.candidato,
          avatarUrl: this.getOrAssignAvatar(item.candidato.id, savedAvatars),
          adjuntos: item.adjuntos
        }));
        
        this.saveAvatars(this.candidatos);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los candidatos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  toggleDetalles(candidatoId: number): void {
    if (this.expandedRows.has(candidatoId)) {
      this.expandedRows.delete(candidatoId);
    } else {
      this.expandedRows.add(candidatoId);
    }
  }

  isExpanded(candidatoId: number): boolean {
    return this.expandedRows.has(candidatoId);
  }

  getFileIcon(extension: string): string {
    const icons: { [key: string]: string } = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️'
    };
    return icons[extension.toLowerCase()] || '📎';
  }

  private getSavedAvatars(): Map<number, string> {
    const saved = localStorage.getItem(this.AVATAR_CACHE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return new Map(Object.entries(parsed).map(([k, v]) => [Number(k), v as string]));
      } catch (e) {
        console.error('Error al parsear avatares guardados', e);
      }
    }
    return new Map();
  }

  private getOrAssignAvatar(candidatoId: number, savedAvatars: Map<number, string>): string {
    if (savedAvatars.has(candidatoId)) {
      return savedAvatars.get(candidatoId)!;
    }
    return this.getRandomAvatar();
  }

  private getRandomAvatar(): string {
    return this.avatarImages[Math.floor(Math.random() * this.avatarImages.length)];
  }

  private saveAvatars(candidatos: CandidatoView[]): void {
    const avatarMap: { [key: number]: string } = {};
    candidatos.forEach(c => {
      avatarMap[c.id] = c.avatarUrl;
    });
    localStorage.setItem(this.AVATAR_CACHE_KEY, JSON.stringify(avatarMap));
  }
}
