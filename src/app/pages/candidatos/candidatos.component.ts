import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdjuntoService } from '../../core/services/adjunto.service';
import { CandidatoView } from '../../shared/models/candidato-view.model';

const AVATAR_CACHE_KEY = 'candidatos-avatars';
const CURRENT_PAGE_KEY = 'candidatos-current-page';

const AVATAR_IMAGES = [
  'https://img.daisyui.com/images/profile/demo/2@94.webp',
  'https://img.daisyui.com/images/profile/demo/3@94.webp',
  'https://img.daisyui.com/images/profile/demo/4@94.webp',
  'https://img.daisyui.com/images/profile/demo/5@94.webp'
] as const;

@Component({
  selector: 'app-candidatos',
  imports: [CommonModule],
  templateUrl: './candidatos.component.html',
})
export class CandidatosComponent {
  Math = Math;
  
  private adjuntoService = inject(AdjuntoService);
  private errorSignal = signal<string>('');

  private candidatosData = toSignal(
    this.adjuntoService.getAllCandidatosConAdjuntos().pipe(
      map(data => {
        this.errorSignal.set('');
        const savedAvatars = this.getSavedAvatars();
        
        const candidatos = data.map(({ candidato, adjuntos }) => ({
          ...candidato,
          avatarUrl: this.getOrAssignAvatar(candidato.id, savedAvatars),
          adjuntos
        }));
        
        return candidatos;
      }),
      tap(candidatos => this.saveAvatars(candidatos)),
      catchError(error => {
        console.error('Error al cargar los candidatos:', error);
        this.errorSignal.set('Error al cargar los candidatos. Por favor, intenta nuevamente.');
        return of([]);
      })
    )
  );

  expandedRows = signal<Set<number>>(new Set());
  currentPage = signal(this.loadSavedPage());
  itemsPerPage = 5;

  candidatos = computed(() => this.candidatosData() ?? []);
  loading = computed(() => this.candidatosData() === undefined);
  error = computed(() => this.errorSignal());

  paginatedCandidatos = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.candidatos().slice(startIndex, endIndex);
  });

  totalPages = computed(() => 
    Math.ceil(this.candidatos().length / this.itemsPerPage)
  );

  pageNumbers = computed(() => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const total = this.totalPages();
    const current = this.currentPage();
    
    if (total <= maxPagesToShow) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, current - 2);
      let endPage = Math.min(total, current + 2);
      
      if (current <= 3) {
        endPage = 5;
      } else if (current >= total - 2) {
        startPage = total - 4;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  });

  private readonly fileIconMap = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'xls': '📊',
    'xlsx': '📊',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️'
  } as const;

  constructor() {
    effect(() => {
      const page = this.currentPage();
      localStorage.setItem(CURRENT_PAGE_KEY, page.toString());
    });
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this.currentPage.set(page);
      this.expandedRows.set(new Set());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  hasPreviousPage(): boolean {
    return this.currentPage() > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage() < this.totalPages();
  }

  toggleDetalles(candidatoId: number): void {
    this.expandedRows.update(current => {
      const newSet = new Set(current);
      if (newSet.has(candidatoId)) {
        newSet.delete(candidatoId);
      } else {
        newSet.add(candidatoId);
      }
      return newSet;
    });
  }

  isExpanded(candidatoId: number): boolean {
    return this.expandedRows().has(candidatoId);
  }

  getFileIcon(extension: string): string {
    return this.fileIconMap[extension.toLowerCase() as keyof typeof this.fileIconMap] || '📎';
  }

  private loadSavedPage(): number {
    const savedPage = localStorage.getItem(CURRENT_PAGE_KEY);
    if (savedPage) {
      const pageNumber = parseInt(savedPage, 10);
      if (pageNumber >= 1) {
        return pageNumber;
      }
    }
    return 1;
  }

  private getSavedAvatars(): Map<number, string> {
    const saved = localStorage.getItem(AVATAR_CACHE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return new Map(Object.entries(parsed).map(([k, v]) => [Number(k), v as string]));
      } catch (error) {
        console.error('Error al parsear avatares guardados:', error);
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
    return AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)];
  }

  private saveAvatars(candidatos: CandidatoView[]): void {
    const avatarMap = candidatos.reduce((acc, { id, avatarUrl }) => {
      acc[id] = avatarUrl;
      return acc;
    }, {} as { [key: number]: string });
    
    localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(avatarMap));
  }
}
