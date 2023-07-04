import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoRespuesta } from '../models/tipo-respuesta';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TipoRespuestaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/tipo-respuesta`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  find(): Observable<TipoRespuesta[]> {
    return this.http.get<TipoRespuesta[]>(`${this.url}/find`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findbyCodigo(codigo: number): Observable<TipoRespuesta> {
    return this.http.get<TipoRespuesta>(`${this.url}/find-codigo/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
