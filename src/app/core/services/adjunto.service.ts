import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAdjunto } from '../../shared/models/adjunto.model';

@Injectable({
  providedIn: 'root'
})
export class AdjuntoService {
  private apiUrl = 'http://localhost:8090/api/v1/adjuntos';
  
  constructor(private http: HttpClient) { }

  getAllCandidatosConAdjuntos(): Observable<ResponseAdjunto[]> {
    return this.http.get<ResponseAdjunto[]>(this.apiUrl);
  }
}
