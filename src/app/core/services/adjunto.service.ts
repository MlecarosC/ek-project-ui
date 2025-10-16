import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAdjunto } from '../../shared/models/adjunto.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdjuntoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/adjuntos`;
  
  constructor(private http: HttpClient) {
  }

  getAllCandidatosConAdjuntos(): Observable<ResponseAdjunto[]> {
    return this.http.get<ResponseAdjunto[]>(this.apiUrl);
  }
}