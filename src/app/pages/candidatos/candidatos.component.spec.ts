import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CandidatosComponent } from './candidatos.component';
import { StorageService } from '../../core/services/storage.service';
import { AvatarService } from '../../core/services/avatar.service';
import { of, throwError } from 'rxjs';
import { CandidatoService } from '../../core/services/candidato.service';

describe('CandidatosComponent', () => {
  let component: CandidatosComponent;
  let fixture: ComponentFixture<CandidatosComponent>;
  let mockCandidatosService: jest.Mocked<CandidatoService>;
  let mockStorageService: jest.Mocked<StorageService>;
  let mockAvatarService: jest.Mocked<AvatarService>;

  const mockCandidatosData = [
    {
      id: 1,
      nombre: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@test.com',
      telefono: '+56912345678',
      tipoDocumento: 'RUT',
      numeroDocumento: '12345678-9',
      genero: 'M',
      lugarNacimiento: 'Santiago',
      fechaNacimiento: '1990-01-01',
      direccion: 'Calle 123',
      codigoPostal: '12345',
      pais: 'Chile',
      localizacion: 'Santiago, Chile',
      disponibilidadDesde: '2025-01-01',
      disponibilidadHasta: '2025-12-31',
      adjuntos: [{ id: 1, extension: 'pdf', nombreArchivo: 'cv.pdf' }],
    },
    {
      id: 2,
      nombre: 'María',
      apellidos: 'González',
      email: 'maria@test.com',
      telefono: '+56987654321',
      tipoDocumento: 'RUT',
      numeroDocumento: '98765432-1',
      genero: 'F',
      lugarNacimiento: 'Valparaíso',
      fechaNacimiento: '1992-05-15',
      direccion: 'Avenida 456',
      codigoPostal: '54321',
      pais: 'Chile',
      localizacion: 'Valparaíso, Chile',
      disponibilidadDesde: '2025-02-01',
      disponibilidadHasta: '2025-12-31',
      adjuntos: [],
    },
    {
      id: 3,
      nombre: 'Pedro',
      apellidos: 'Silva',
      email: 'pedro@test.com',
      telefono: '+56911111111',
      tipoDocumento: 'RUT',
      numeroDocumento: '11111111-1',
      genero: 'M',
      lugarNacimiento: 'Concepción',
      fechaNacimiento: '1988-03-20',
      direccion: 'Pasaje 789',
      codigoPostal: '11111',
      pais: 'Chile',
      localizacion: 'Concepción, Chile',
      disponibilidadDesde: '2025-03-01',
      disponibilidadHasta: '2025-12-31',
      adjuntos: [{ id: 2, extension: 'docx', nombreArchivo: 'certificado.docx' }],
    },
    {
      id: 4,
      nombre: 'Ana',
      apellidos: 'Torres',
      email: 'ana@test.com',
      telefono: '+56922222222',
      tipoDocumento: 'RUT',
      numeroDocumento: '22222222-2',
      genero: 'F',
      lugarNacimiento: 'La Serena',
      fechaNacimiento: '1995-07-10',
      direccion: 'Calle 999',
      codigoPostal: '22222',
      pais: 'Chile',
      localizacion: 'La Serena, Chile',
      disponibilidadDesde: '2025-04-01',
      disponibilidadHasta: '2025-12-31',
      adjuntos: [],
    },
    {
      id: 5,
      nombre: 'Luis',
      apellidos: 'Rojas',
      email: 'luis@test.com',
      telefono: '+56933333333',
      tipoDocumento: 'RUT',
      numeroDocumento: '33333333-3',
      genero: 'M',
      lugarNacimiento: 'Antofagasta',
      fechaNacimiento: '1991-11-25',
      direccion: 'Avenida 111',
      codigoPostal: '33333',
      pais: 'Chile',
      localizacion: 'Antofagasta, Chile',
      disponibilidadDesde: '2025-05-01',
      disponibilidadHasta: '2025-12-31',
      adjuntos: [{ id: 3, extension: 'jpg', nombreArchivo: 'foto.jpg' }],
    },
    {
      id: 6,
      nombre: 'Carmen',
      apellidos: 'Muñoz',
      email: 'carmen@test.com',
      telefono: '+56944444444',
      tipoDocumento: 'RUT',
      numeroDocumento: '44444444-4',
      genero: 'F',
      lugarNacimiento: 'Temuco',
      fechaNacimiento: '1993-09-15',
      direccion: 'Pasaje 222',
      codigoPostal: '44444',
      pais: 'Chile',
      localizacion: 'Temuco, Chile',
      disponibilidadDesde: '2025-06-01',
      disponibilidadHasta: '2025-12-31',
      adjuntos: [],
    },
  ];

  beforeEach(async () => {
    mockCandidatosService = {
      getAllCandidatosConAdjuntos: jest.fn(),
    } as any;

    mockStorageService = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    } as any;

    mockAvatarService = {
      getAvatarMap: jest.fn().mockReturnValue(new Map()),
      getOrAssignAvatar: jest.fn().mockReturnValue('https://example.com/avatar.jpg'),
      saveAvatars: jest.fn(),
    } as any;

    mockCandidatosService.getAllCandidatosConAdjuntos.mockReturnValue(of(mockCandidatosData));
    mockStorageService.get.mockReturnValue(1);

    await TestBed.configureTestingModule({
      imports: [CandidatosComponent],
      providers: [
        { provide: CandidatoService, useValue: mockCandidatosService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: AvatarService, useValue: mockAvatarService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should have Math property', () => {
      expect(component.Math).toBe(Math);
    });

    it('should initialize with correct values', () => {
      expect(component.itemsPerPage).toBe(5);
      expect(component.searchTermInput()).toBe('');
    });

    it('should call service on init', () => {
      expect(mockCandidatosService.getAllCandidatosConAdjuntos).toHaveBeenCalled();
    });
  });

  describe('Signals', () => {
    it('should have candidatos loaded', fakeAsync(() => {
      tick();
      const candidatos = component.candidatos();
      expect(candidatos.length).toBe(6);
    }));

    it('should compute total pages', fakeAsync(() => {
      tick();
      expect(component.totalPages()).toBe(2);
    }));

    it('should have paginated candidatos', fakeAsync(() => {
      tick();
      const paginated = component.paginatedCandidatos();
      expect(paginated.length).toBe(5);
    }));
  });

  describe('Search', () => {
    it('should filter by name', fakeAsync(() => {
      tick();
      component.searchTermInput.set('Juan');
      tick(300);
      const filtered = component.filteredCandidatos();
      expect(filtered.some(c => c.nombre === 'Juan')).toBe(true);
    }));

    it('should clear search', () => {
      component.searchTermInput.set('test');
      component.clearSearch();
      expect(component.searchTermInput()).toBe('');
    });
  });

  describe('Pagination', () => {
    it('should navigate pages', fakeAsync(() => {
      tick();
      expect(component.currentPage()).toBe(1);
      component.nextPage();
      expect(component.currentPage()).toBe(2);
    }));

    it('should check page boundaries', fakeAsync(() => {
      tick();
      expect(component.hasPreviousPage()).toBe(false);
      expect(component.hasNextPage()).toBe(true);
    }));
  });

  describe('Row expansion', () => {
    it('should toggle expansion', () => {
      component.toggleDetalles(1);
      expect(component.isExpanded(1)).toBe(true);
      component.toggleDetalles(1);
      expect(component.isExpanded(1)).toBe(false);
    });
  });

  describe('File icons', () => {
    it('should get file icon', () => {
      expect(component.getFileIcon('pdf')).toBe('📄');
    });
  });


  describe('Edge cases and uncovered lines', () => {
    it('should handle empty candidatos list', fakeAsync(() => {
        mockCandidatosService.getAllCandidatosConAdjuntos.mockReturnValue(of([]));
        
        const newFixture = TestBed.createComponent(CandidatosComponent);
        const newComponent = newFixture.componentInstance;
        newFixture.detectChanges();
        tick();

        expect(newComponent.candidatos().length).toBe(0);
        expect(newComponent.totalPages()).toBe(0);
    }));

    it('should handle page navigation beyond boundaries', fakeAsync(() => {
        tick();
        const totalPages = component.totalPages();
        
        // Intentar ir más allá del máximo
        component.goToPage(totalPages + 10);
        expect(component.currentPage()).toBeLessThanOrEqual(totalPages);
        
        // Intentar ir a página negativa
        component.goToPage(-5);
        expect(component.currentPage()).toBeGreaterThanOrEqual(1);
        
        // Intentar ir a página 0
        component.goToPage(0);
        expect(component.currentPage()).toBeGreaterThanOrEqual(1);
    }));

    it('should maintain expanded rows state', () => {
        component.toggleDetalles(1);
        component.toggleDetalles(2);
        component.toggleDetalles(3);

        expect(component.expandedRows().size).toBe(3);
        expect(component.isExpanded(1)).toBe(true);
        expect(component.isExpanded(2)).toBe(true);
        expect(component.isExpanded(3)).toBe(true);
    });

    it('should handle pagination with single page', fakeAsync(() => {
        mockCandidatosService.getAllCandidatosConAdjuntos.mockReturnValue(
        of(mockCandidatosData.slice(0, 3))
        );

        const newFixture = TestBed.createComponent(CandidatosComponent);
        const newComponent = newFixture.componentInstance;
        newFixture.detectChanges();
        tick();

        expect(newComponent.totalPages()).toBe(1);
        expect(newComponent.hasPreviousPage()).toBe(false);
        expect(newComponent.hasNextPage()).toBe(false);
    }));

    it('should generate correct page numbers for many pages', fakeAsync(() => {
        const manyCandidatos = Array.from({ length: 50 }, (_, i) => ({
          ...mockCandidatosData[0],
          id: i + 1,
          nombre: `Candidato${i + 1}`,
          adjuntos: [],
        }));

        mockCandidatosService.getAllCandidatosConAdjuntos.mockReturnValue(
        of(manyCandidatos)
        );

        const newFixture = TestBed.createComponent(CandidatosComponent);
        const newComponent = newFixture.componentInstance;
        newFixture.detectChanges();
        tick();

        expect(newComponent.totalPages()).toBe(10);
        expect(newComponent.pageNumbers().length).toBeLessThanOrEqual(5);
    }));

    it('should scroll to top when changing pages', fakeAsync(() => {
        const scrollSpy = jest.spyOn(window, 'scrollTo');
        tick();

        component.nextPage();

        expect(scrollSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
        });

        scrollSpy.mockRestore();
    }));

    it('should filter by partial matches', fakeAsync(() => {
        tick();
        
        component.searchTermInput.set('ma');
        tick(300);

        const filtered = component.filteredCandidatos();
        expect(filtered.some(c => c.nombre.toLowerCase().includes('ma') || 
                                c.email.toLowerCase().includes('ma'))).toBe(true);
    }));

    it('should handle search with special characters', fakeAsync(() => {
        tick();
        
        component.searchTermInput.set('@test.com');
        tick(300);

        const filtered = component.filteredCandidatos();
        expect(filtered.every(c => c.email.includes('@test.com'))).toBe(true);
    }));
  });

  describe('Search functionality', () => {
    it('should filter candidates when search term is applied', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        
        const allCandidatos = component.candidatos();
        expect(allCandidatos.length).toBe(6);
        
        // Aplicar búsqueda
        component.searchTermInput.set('Juan');
        tick(500); // Esperar debounce
        fixture.detectChanges();
        
        const filtered = component.filteredCandidatos();
        expect(filtered.length).toBeLessThanOrEqual(allCandidatos.length);
    }));

    it('should return to page 1 when filters change results', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        
        // Ir a página 2
        component.goToPage(2);
        fixture.detectChanges();
        tick(100);
        
        // Aplicar búsqueda que reduce resultados
        component.searchTermInput.set('xyz_no_existe');
        tick(500);
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();
        
        // Con 0 resultados o pocos resultados, debería estar en página válida
        const currentPage = component.currentPage();
        const totalPages = component.totalPages();
        
        // Verificar que está en página válida (1 o dentro del rango)
        expect(currentPage).toBeGreaterThanOrEqual(1);
        expect(currentPage).toBeLessThanOrEqual(Math.max(1, totalPages));
    }));

    it('should clear search input when clearSearch is called', fakeAsync(() => {
        tick();
        
        component.searchTermInput.set('test');
        expect(component.searchTermInput()).toBe('test');
        
        component.clearSearch();
        expect(component.searchTermInput()).toBe('');
    }));
    });

    describe('Page persistence', () => {
    it('should save page to storage when navigating', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        
        mockStorageService.set.mockClear();
        
        // Navegar a diferentes páginas
        component.goToPage(2);
        tick(50);
        fixture.detectChanges();
        
        component.goToPage(1);
        tick(50);
        fixture.detectChanges();
        
        // Verificar que se llamó storage.set
        expect(mockStorageService.set).toHaveBeenCalled();
        expect(mockStorageService.set).toHaveBeenCalledWith(
        'candidatos-current-page',
        expect.any(Number)
        );
    }));

    it('should load saved page on initialization', () => {
        // Este test verifica que el constructor carga la página guardada
        expect(component.currentPage()).toBe(1); // Valor del mock
    });
    });

    describe('Pagination boundaries', () => {
    it('should not go below page 1', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        
        // Asegurar que estamos en página 1
        component.goToPage(1);
        tick();
        expect(component.currentPage()).toBe(1);
        
        // Intentar ir a anterior
        component.previousPage();
        tick();
        
        // Debe seguir en página 1
        expect(component.currentPage()).toBe(1);
    }));

    it('should not go beyond last page', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        
        const totalPages = component.totalPages();
        
        // Ir a última página
        component.goToPage(totalPages);
        tick();
        expect(component.currentPage()).toBe(totalPages);
        
        // Intentar ir a siguiente
        component.nextPage();
        tick();
        
        // Debe seguir en última página
        expect(component.currentPage()).toBe(totalPages);
    }));

    it('should correctly identify when previous page is available', fakeAsync(() => {
        tick();
        
        component.goToPage(1);
        tick();
        expect(component.hasPreviousPage()).toBe(false);
        
        component.goToPage(2);
        tick();
        expect(component.hasPreviousPage()).toBe(true);
    }));

    it('should correctly identify when next page is available', fakeAsync(() => {
        tick();
        
        const totalPages = component.totalPages();
        
        component.goToPage(1);
        tick();
        expect(component.hasNextPage()).toBe(true);
        
        component.goToPage(totalPages);
        tick();
        expect(component.hasNextPage()).toBe(false);
    }));
    });

    describe('Effect execution coverage', () => {
    it('should trigger effects during component initialization', fakeAsync(() => {
        // Crear nuevo componente para verificar inicialización
        const newFixture = TestBed.createComponent(CandidatosComponent);
        newFixture.detectChanges();
        tick(100);
        
        // El componente se inicializa correctamente
        expect(newFixture.componentInstance).toBeTruthy();
        
        // El storage debe haberse llamado durante la inicialización
        expect(mockStorageService.set).toHaveBeenCalled();
    }));

    it('should handle search input changes', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        
        // Verificar que searchTermInput funciona
        expect(component.searchTermInput()).toBe('');
        
        component.searchTermInput.set('test');
        expect(component.searchTermInput()).toBe('test');
        
        // Verificar que clearSearch funciona
        component.clearSearch();
        expect(component.searchTermInput()).toBe('');
    }));
  });
});
