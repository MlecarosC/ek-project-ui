import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdjuntoService } from '../../core/services/adjunto.service';
import { StorageService } from '../../core/services/storage.service';
import { AvatarService } from '../../core/services/avatar.service';
import { STORAGE_KEYS } from '../../shared/constants/storage-keys';
import { getFileIcon } from '../../shared/constants/file-icons';

@Component({
  selector: 'app-candidatos',
  imports: [CommonModule],
  templateUrl: './candidatos.component.html',
})
export class CandidatosComponent {
  Math = Math;

  private adjuntoService = inject(AdjuntoService);
  private storageService = inject(StorageService);
  private avatarService = inject(AvatarService);
  
  private errorSignal = signal<string>('');
  private expandedRowsSignal = signal<Set<number>>(new Set());
  private currentPageSignal = signal(this.loadSavedPage());

  private candidatosData = toSignal(
    this.adjuntoService.getAllCandidatosConAdjuntos().pipe(
      map(data => {
        this.errorSignal.set('');
        const savedAvatars = this.avatarService.getAvatarMap();
        
        const candidatos = data.map(({ candidato, adjuntos }) => ({
          ...candidato,
          avatarUrl: this.avatarService.getOrAssignAvatar(candidato.id, savedAvatars),
          adjuntos
        }));
        
        return candidatos;
      }),
      tap(candidatos => this.avatarService.saveAvatars(candidatos)),
      catchError(error => {
        console.error('Error al cargar los candidatos:', error);
        this.errorSignal.set('Error al cargar los candidatos. Por favor, intenta nuevamente.');
        return of([]);
      })
    )
  );

  readonly expandedRows = this.expandedRowsSignal.asReadonly();
  readonly currentPage = this.currentPageSignal.asReadonly();
  readonly itemsPerPage = 5;

  readonly candidatos = computed(() => this.candidatosData() ?? []);
  readonly loading = computed(() => this.candidatosData() === undefined);
  readonly error = computed(() => this.errorSignal());

  readonly paginatedCandidatos = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.candidatos().slice(startIndex, endIndex);
  });

  readonly totalPages = computed(() => 
    Math.ceil(this.candidatos().length / this.itemsPerPage)
  );

  readonly pageNumbers = computed(() => {
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

  readonly getFileIcon = getFileIcon;

  constructor() {
    effect(() => {
      this.storageService.set(STORAGE_KEYS.CURRENT_PAGE, this.currentPage());
    });
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this.currentPageSignal.set(page);
      this.expandedRowsSignal.set(new Set());
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
    this.expandedRowsSignal.update(current => {
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

  private loadSavedPage(): number {
    const savedPage = this.storageService.get<number>(STORAGE_KEYS.CURRENT_PAGE);
    return savedPage && savedPage >= 1 ? savedPage : 1;
  }
}
