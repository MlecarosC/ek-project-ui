import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdjuntoService } from './adjunto.service';
import { environment } from '../../../environments/environment.development';
import { ResponseAdjunto } from '../../shared/models/adjunto.model';
import { fakeAsync, tick } from '@angular/core/testing';

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

  describe('Error Handling', () => {
    it('should handle network error (ErrorEvent)', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const mockErrorEvent = new ErrorEvent('Network error', {
        message: 'Failed to fetch',
        });

        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Handle initial request + 2 retries = 3 total requests
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.error(mockErrorEvent);
        
        if (i < 2) {
            tick(1000); // Wait for retry delay
        }
        }

        tick(); // Process any remaining async operations

        expect(errorReceived).toBeDefined();
        expect(errorReceived?.message).toContain('Error de conexión');
        expect(errorReceived?.message).toContain('Failed to fetch');
        
        consoleErrorSpy.mockRestore();
    }));

    it('should handle HTTP 404 error', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Handle initial request + 2 retries = 3 total requests
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.flush('Not Found', { status: 404, statusText: 'Not Found' });
        
        if (i < 2) {
            tick(1000); // Wait for retry delay
        }
        }

        tick();

        expect(errorReceived).toBeDefined();
        expect(errorReceived?.message).toContain('Error del servidor');
        expect(errorReceived?.message).toContain('404');
        
        consoleErrorSpy.mockRestore();
    }));

    it('should handle HTTP 500 error', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Handle initial request + 2 retries = 3 total requests
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.flush('Internal Server Error', {
            status: 500,
            statusText: 'Internal Server Error',
        });
        
        if (i < 2) {
            tick(1000);
        }
        }

        tick();

        expect(errorReceived).toBeDefined();
        expect(errorReceived?.message).toContain('Error del servidor');
        expect(errorReceived?.message).toContain('500');
        
        consoleErrorSpy.mockRestore();
    }));

    it('should handle HTTP 401 unauthorized error', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Handle initial request + 2 retries = 3 total requests
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.flush('Unauthorized', {
            status: 401,
            statusText: 'Unauthorized',
        });
        
        if (i < 2) {
            tick(1000);
        }
        }

        tick();

        expect(errorReceived).toBeDefined();
        expect(errorReceived?.message).toContain('Error del servidor');
        expect(errorReceived?.message).toContain('401');
        
        consoleErrorSpy.mockRestore();
    }));

    it('should log error to console', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Handle initial request + 2 retries = 3 total requests
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.flush('Server Error', { status: 500, statusText: 'Server Error' });
        
        if (i < 2) {
            tick(1000);
        }
        }

        tick();

        expect(errorReceived).toBeDefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error en AdjuntoService:',
        expect.stringContaining('Error del servidor')
        );
        
        consoleErrorSpy.mockRestore();
    }));

    it('should handle generic error without status', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Handle initial request + 2 retries = 3 total requests
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.flush(null, { status: 0, statusText: 'Unknown Error' });
        
        if (i < 2) {
            tick(1000);
        }
        }

        tick();

        expect(errorReceived).toBeDefined();
        expect(errorReceived?.message).toContain('Error del servidor');
        
        consoleErrorSpy.mockRestore();
    }));
    });

    describe('Retry Behavior', () => {
    it('should retry failed requests 2 times', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        let errorReceived: Error | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: () => fail('Should have failed after retries'),
        error: (error) => {
            errorReceived = error;
        },
        });

        // Expect 3 requests: initial + 2 retries
        for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(apiUrl);
        req.flush('Error', { status: 500, statusText: 'Server Error' });
        
        if (i < 2) {
            tick(1000); // Wait for retry delay
        }
        }

        tick();

        expect(errorReceived).toBeDefined();
        expect(errorReceived?.message).toContain('Error del servidor');
        
        consoleErrorSpy.mockRestore();
    }));

    it('should succeed after first retry', fakeAsync(() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
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
        ];

        let resultData: ResponseAdjunto[] | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: (data) => {
            resultData = data;
        },
        error: () => fail('Should have succeeded after retry'),
        });

        // First attempt fails
        const req1 = httpMock.expectOne(apiUrl);
        req1.flush('Error', { status: 500, statusText: 'Server Error' });
        
        tick(1000); // Wait for retry delay

        // Second attempt (first retry) succeeds
        const req2 = httpMock.expectOne(apiUrl);
        req2.flush(mockData);

        tick();

        expect(resultData).toBeDefined();
        expect(resultData).toEqual(mockData);
        
        consoleErrorSpy.mockRestore();
    }));

    it('should succeed on initial request without retrying', fakeAsync(() => {
        const mockData: ResponseAdjunto[] = [
        {
            candidato: {
            id: 1,
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

        let resultData: ResponseAdjunto[] | undefined;

        service.getAllCandidatosConAdjuntos().subscribe({
        next: (data) => {
            resultData = data;
        },
        error: () => fail('Should have succeeded'),
        });

        // Only one request needed (success on first try)
        const req = httpMock.expectOne(apiUrl);
        req.flush(mockData);

        tick();

        expect(resultData).toBeDefined();
        expect(resultData).toEqual(mockData);
    }));
  });
});
