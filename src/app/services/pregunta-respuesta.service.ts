import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { PreguntaRespuestas } from '../models/pregunta-respuestas';

@Injectable({
  providedIn: 'root',
})
export class PreguntaRespuestaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/pregunta-respuesta`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  userLogeado: String = this.authservice.user.username;
  find(): Observable<PreguntaRespuestas[]> {
    return this.http.get<PreguntaRespuestas[]>(`${this.url}/find`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  findbyCodigo(codigo: number): Observable<PreguntaRespuestas[]> {
    return this.http.get<PreguntaRespuestas[]>(`${this.url}/find/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findbyCuestionario(codigo: number): Observable<PreguntaRespuestas[]> {
    return this.http.get<PreguntaRespuestas[]>(
      `${this.url}/find-cue/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  create(cuestionarioUsuarioTipo: PreguntaRespuestas): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      cuestionarioUsuarioTipo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  update(cuestionarioUsuarioTipo: PreguntaRespuestas): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      cuestionarioUsuarioTipo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  delete(codigo: number): Observable<number> {
    return this.http.get<number>(
      `${this.url}/remove/${codigo}/${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
  findByPregunta(codigo: number): Observable<PreguntaRespuestas[]> {
    return this.http.get<PreguntaRespuestas[]>(
      `${this.url}/find-pregunta/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
