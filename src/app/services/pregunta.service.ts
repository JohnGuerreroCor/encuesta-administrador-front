import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Pregunta } from '../models/pregunta';

@Injectable({
  providedIn: 'root',
})
export class PreguntaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/pregunta`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  userLogeado: String = this.authservice.user.username;

  find(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.url}/find`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  findbyCodigo(codigo: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(`${this.url}/find-codigo/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findbyCues(codigo: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.url}/find-cues/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findbyCuest(codigo: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.url}/find-cuest/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findbyDependencia(codigo: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.url}/find-dependencia/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findAdminList(codigo: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.url}/find-admin/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  create(pregunta: Pregunta): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      pregunta,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  update(pregunta: Pregunta): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      pregunta,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  delete(codigo: number): Observable<number> {
    return this.http.get<number>(
      `${this.url}/remove/${codigo}/${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
  //servicio para relacionar preguntas y respuestas
  findbyCuestAndRYS(codigo: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.url}/pre-relacion/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
