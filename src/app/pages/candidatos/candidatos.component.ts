import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CandidatoService } from '../../core/services/candidato.service';
import { StorageService } from '../../core/services/storage.service';
import { AvatarService } from '../../core/services/avatar.service';
import { STORAGE_KEYS } from '../../shared/constants/storage-keys';
import { getFileIcon } from '../../shared/constants/file-icons';
import { debounceSignal } from '../../shared/utils/debounce-signal';
import { CandidatoView } from '../../shared/models/candidato-view.model';

@Component({
  selector: 'app-candidatos',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidatos.component.html',
})
export class CandidatosComponent {
  Math = Math;

  private candidatoService = inject(CandidatoService);
  private storageService = inject(StorageService);
  private avatarService = inject(AvatarService);
  
  private errorSignal = signal<string>('');
  private expandedRowsSignal = signal<Set<number>>(new Set());
  private currentPageSignal = signal(this.loadSavedPage());
  
  // Signals para el modal de eliminación
  private showDeleteModalSignal = signal(false);
  private candidatoToDeleteSignal = signal<{ id: number; nombre: string } | null>(null);
  private deletingSignal = signal(false);
  
  // Signals para toast de notificación
  private showToastSignal = signal(false);
  private toastMessageSignal = signal('');
  private toastTypeSignal = signal<'success' | 'error'>('success');

  searchTermInput = signal<string>('');

  readonly searchTerm = debounceSignal(this.searchTermInput, 300);

  private candidatosSignal = signal<CandidatoView[]>([]);

  private candidatosData = toSignal(
    this.candidatoService.getAllCandidatosConAdjuntos().pipe(
      map(data => {
        this.errorSignal.set('');
        const savedAvatars = this.avatarService.getAvatarMap();

        const candidatos = data.map(({ candidato, adjuntos }) => ({
          ...candidato,
          avatarUrl: this.avatarService.getOrAssignAvatar(candidato.id, savedAvatars),
          adjuntos
        }));

        this.candidatosSignal.set(candidatos);
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

  readonly showDeleteModal = this.showDeleteModalSignal.asReadonly();
  readonly candidatoToDelete = this.candidatoToDeleteSignal.asReadonly();
  readonly deleting = this.deletingSignal.asReadonly();
  readonly showToast = this.showToastSignal.asReadonly();
  readonly toastMessage = this.toastMessageSignal.asReadonly();
  readonly toastType = this.toastTypeSignal.asReadonly();

  readonly candidatos = computed(() => this.candidatosSignal());
  readonly loading = computed(() => this.candidatosData() === undefined);
  readonly error = computed(() => this.errorSignal());

  readonly filteredCandidatos = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allCandidatos = this.candidatos();

    if (!term) {
      return allCandidatos;
    }

    return allCandidatos.filter(candidato => {
      const nombreCompleto = `${candidato.nombre} ${candidato.apellidos}`.toLowerCase();
      const email = candidato.email.toLowerCase();
      const pais = candidato.pais.toLowerCase();

      return nombreCompleto.includes(term) || 
             email.includes(term) || 
             pais.includes(term);
    });
  });

  readonly paginatedCandidatos = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCandidatos().slice(startIndex, endIndex);
  });

  readonly totalPages = computed(() => 
    Math.ceil(this.filteredCandidatos().length / this.itemsPerPage)
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

    effect(() => {
      this.searchTerm();
      this.currentPageSignal.set(1);
    });
  }

  clearSearch(): void {
    this.searchTermInput.set('');
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

  // Métodos para el modal de eliminación
  openDeleteModal(id: number, nombre: string, apellidos: string): void {
    this.candidatoToDeleteSignal.set({ 
      id, 
      nombre: `${nombre} ${apellidos}` 
    });
    this.showDeleteModalSignal.set(true);
  }

  closeDeleteModal(): void {
    if (!this.deleting()) {
      this.showDeleteModalSignal.set(false);
      this.candidatoToDeleteSignal.set(null);
    }
  }

  confirmDelete(): void {
    const candidato = this.candidatoToDelete();
    if (!candidato) return;

    this.deletingSignal.set(true);

    this.candidatoService.deleteCandidato(candidato.id).subscribe({
      next: () => {
        const updatedCandidatos = this.candidatosSignal().filter(c => c.id !== candidato.id);
        this.candidatosSignal.set(updatedCandidatos);

        this.showToastWithMessage('Candidato eliminado exitosamente', 'success');

        this.deletingSignal.set(false);
        this.closeDeleteModal();

        if (this.paginatedCandidatos().length === 0 && this.currentPage() > 1) {
          this.previousPage();
        }
      },
      error: (error) => {
        console.error('Error al eliminar candidato:', error);
        this.showToastWithMessage(
          'Error al eliminar el candidato. Por favor, intenta nuevamente.',
          'error'
        );
        this.deletingSignal.set(false);
      }
    });
  }

  private showToastWithMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessageSignal.set(message);
    this.toastTypeSignal.set(type);
    this.showToastSignal.set(true);

    setTimeout(() => {
      this.showToastSignal.set(false);
    }, 3000);
  }
}
