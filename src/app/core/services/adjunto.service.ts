import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, retry } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResponseAdjunto } from '../../shared/models/adjunto.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdjuntoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/adjuntos`;
  
  getAllCandidatosConAdjuntos(): Observable<ResponseAdjunto[]> {
    return this.http.get<ResponseAdjunto[]>(this.apiUrl).pipe(
      timeout(environment.apiTimeout),
      retry({ count: 2, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error al cargar los candidatos';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor (${error.status}): ${error.message}`;
    }
    
    console.error('Error en AdjuntoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
