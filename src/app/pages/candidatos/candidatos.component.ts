import { Component, OnInit, signal, computed, effect } from '@angular/core';
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
  
  candidatos = signal<CandidatoView[]>([]);
  loading = signal(true);
  error = signal('');
  expandedRows = signal<Set<number>>(new Set());
  currentPage = signal(1);
  itemsPerPage = 5;

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

  private readonly AVATAR_CACHE_KEY = 'candidatos-avatars';
  private readonly CURRENT_PAGE_KEY = 'candidatos-current-page';
  
  private avatarImages = [
    'https://img.daisyui.com/images/profile/demo/2@94.webp',
    'https://img.daisyui.com/images/profile/demo/3@94.webp',
    'https://img.daisyui.com/images/profile/demo/4@94.webp',
    'https://img.daisyui.com/images/profile/demo/5@94.webp'
  ];

  constructor(private adjuntoService: AdjuntoService) {
    effect(() => {
      const page = this.currentPage();
      localStorage.setItem(this.CURRENT_PAGE_KEY, page.toString());
    });
  }

  ngOnInit(): void {
    this.loadSavedPage();
    this.loadCandidatos();
  }

  loadCandidatos(): void {
    this.adjuntoService.getAllCandidatosConAdjuntos().subscribe({
      next: (data) => {
        const savedAvatars = this.getSavedAvatars();
        
        const candidatos = data.map(item => ({
          ...item.candidato,
          avatarUrl: this.getOrAssignAvatar(item.candidato.id, savedAvatars),
          adjuntos: item.adjuntos
        }));
        
        this.candidatos.set(candidatos);
        this.saveAvatars(candidatos);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Error al cargar los candidatos');
        this.loading.set(false);
        console.error('Error:', error);
      }
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

  private loadSavedPage(): void {
    const savedPage = localStorage.getItem(this.CURRENT_PAGE_KEY);
    if (savedPage) {
      const pageNumber = parseInt(savedPage, 10);
      if (pageNumber >= 1) {
        this.currentPage.set(pageNumber);
      }
    }
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
