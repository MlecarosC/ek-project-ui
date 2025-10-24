import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { Adjunto } from '../../shared/models/adjunto.model';
import { AdjuntoCreate } from '../../shared/models/adjunto-create.model';

@Injectable({
  providedIn: 'root'
})
export class AdjuntoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/adjuntos`;

  createAdjuntos(adjuntos: AdjuntoCreate[]): Observable<Adjunto[]> {
    return this.http.post<Adjunto[]>(this.apiUrl, adjuntos).pipe(
      timeout(environment.apiTimeout)
    );
  }
}
