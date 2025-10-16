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
  Math = Math;
  
  candidatos: CandidatoView[] = [];
  loading = true;
  error = '';
  
  // Control de filas expandidas
  expandedRows = new Set<number>();

  // Paginación
  currentPage = 1;
  itemsPerPage = 5;

  private readonly AVATAR_CACHE_KEY = 'candidatos-avatars';
  private readonly CURRENT_PAGE_KEY = 'candidatos-current-page';
  
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
        
        // Cargar la página guardada después de tener los datos
        this.loadSavedPage();
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los candidatos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  // Obtener candidatos de la página actual
  get paginatedCandidatos(): CandidatoView[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.candidatos.slice(startIndex, endIndex);
  }

  // Calcular el número total de páginas
  get totalPages(): number {
    return Math.ceil(this.candidatos.length / this.itemsPerPage);
  }

  // Obtener array de números de página para mostrar
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, this.currentPage + 2);
      
      if (this.currentPage <= 3) {
        endPage = 5;
      } else if (this.currentPage >= this.totalPages - 2) {
        startPage = this.totalPages - 4;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Navegar a una página específica
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.expandedRows.clear();
      this.savePage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Ir a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Ir a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Verificar si hay página anterior
  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  // Verificar si hay página siguiente
  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  // Guardar la página actual en localStorage
  private savePage(): void {
    localStorage.setItem(this.CURRENT_PAGE_KEY, this.currentPage.toString());
  }

  // Cargar la página guardada desde localStorage
  private loadSavedPage(): void {
    const savedPage = localStorage.getItem(this.CURRENT_PAGE_KEY);
    
    if (savedPage) {
      const pageNumber = parseInt(savedPage, 10);
      
      // Validar que la página guardada sea válida
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      } else {
        // Si la página guardada no es válida, ir a la página 1
        this.currentPage = 1;
        this.savePage();
      }
    }
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