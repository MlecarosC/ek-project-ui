import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CandidatosComponent } from './candidatos.component';
import { AdjuntoService } from '../../core/services/adjunto.service';
import { StorageService } from '../../core/services/storage.service';
import { AvatarService } from '../../core/services/avatar.service';
import { of, throwError } from 'rxjs';

describe('CandidatosComponent', () => {
  let component: CandidatosComponent;
  let fixture: ComponentFixture<CandidatosComponent>;
  let mockAdjuntoService: jest.Mocked<AdjuntoService>;
  let mockStorageService: jest.Mocked<StorageService>;
  let mockAvatarService: jest.Mocked<AvatarService>;

  const mockCandidatosData = [
    {
      candidato: {
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
      },
      adjuntos: [{ id: 1, extension: 'pdf', nombreArchivo: 'cv.pdf' }],
    },
    {
      candidato: {
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
      },
      adjuntos: [],
    },
    {
      candidato: {
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
      },
      adjuntos: [{ id: 2, extension: 'docx', nombreArchivo: 'certificado.docx' }],
    },
    {
      candidato: {
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
      },
      adjuntos: [],
    },
    {
      candidato: {
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
      },
      adjuntos: [{ id: 3, extension: 'jpg', nombreArchivo: 'foto.jpg' }],
    },
    {
      candidato: {
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
      },
      adjuntos: [],
    },
  ];

  beforeEach(async () => {
    mockAdjuntoService = {
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

    mockAdjuntoService.getAllCandidatosConAdjuntos.mockReturnValue(of(mockCandidatosData));
    mockStorageService.get.mockReturnValue(1);

    await TestBed.configureTestingModule({
      imports: [CandidatosComponent],
      providers: [
        { provide: AdjuntoService, useValue: mockAdjuntoService },
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
      expect(mockAdjuntoService.getAllCandidatosConAdjuntos).toHaveBeenCalled();
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
});
