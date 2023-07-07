import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { RespuestaOpciones } from '../models/respuesta-opciones';

@Injectable({
  providedIn: 'root',
})
export class RespuestaOpcionesService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/respuesta-opciones`;
  uaa: number = this.authservice.obtenerUaa();

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }
  userLogeado: String = this.authservice.user.username;

  find(): Observable<RespuestaOpciones[]> {
    return this.http.get<RespuestaOpciones[]>(`${this.url}/find/${this.uaa}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  findbyCodigo(codigo: number): Observable<RespuestaOpciones[]> {
    return this.http.get<RespuestaOpciones[]>(`${this.url}/find/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  create(respuestaOpciones: RespuestaOpciones): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      respuestaOpciones,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  update(respuestaOpciones: RespuestaOpciones): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      respuestaOpciones,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  delete(codigo: number): Observable<number> {
    return this.http.get<number>(
      `${this.url}/remove/${codigo}/${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
