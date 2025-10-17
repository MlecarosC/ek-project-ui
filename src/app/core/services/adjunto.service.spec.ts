import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdjuntoService } from './adjunto.service';
import { environment } from '../../../environments/environment.development';
import { ResponseAdjunto } from '../../shared/models/adjunto.model';

describe('AdjuntoService', () => {
  let service: AdjuntoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/adjuntos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdjuntoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AdjuntoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCandidatosConAdjuntos', () => {
    it('should fetch candidatos with adjuntos successfully', (done) => {
      const mockData: ResponseAdjunto[] = [
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
          adjuntos: [
            {
              id: 1,
              extension: 'pdf',
              nombreArchivo: 'cv.pdf',
            },
          ],
        },
      ];

      service.getAllCandidatosConAdjuntos().subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          expect(data.length).toBe(1);
          expect(data[0].candidato.nombre).toBe('Juan');
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle empty response', (done) => {
      const emptyData: ResponseAdjunto[] = [];

      service.getAllCandidatosConAdjuntos().subscribe({
        next: (data) => {
          expect(data).toEqual([]);
          expect(data.length).toBe(0);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(emptyData);
    });

    it('should handle multiple candidatos', (done) => {
      const mockData: ResponseAdjunto[] = [
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
          adjuntos: [],
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
          adjuntos: [
            { id: 1, extension: 'pdf', nombreArchivo: 'cv.pdf' },
          ],
        },
      ];

      service.getAllCandidatosConAdjuntos().subscribe({
        next: (data) => {
          expect(data.length).toBe(2);
          expect(data[0].candidato.nombre).toBe('Juan');
          expect(data[1].candidato.nombre).toBe('María');
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockData);
    });
  });
});
