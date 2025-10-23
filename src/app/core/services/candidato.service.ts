import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { CandidatoConAdjuntos } from '../../shared/models/candidato-adjuntos.model';


@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/candidatos`;
  
  deleteCandidato(candidatoId: number): Observable<void> {
    const url = `${this.apiUrl}/${candidatoId}`;
    
    return this.http.delete<void>(url).pipe(
      timeout(environment.apiTimeout),
      catchError(this.handleError)
    );
  }

  getAllCandidatosConAdjuntos(): Observable<CandidatoConAdjuntos[]> {
    return this.http.get<CandidatoConAdjuntos[]>(`${this.apiUrl}/adjuntos`).pipe(
      timeout(environment.apiTimeout),
      retry({ count: 2, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error al procesar la solicitud';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor (${error.status}): ${error.message}`;
    }
    
    console.error('Error en CandidatoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
