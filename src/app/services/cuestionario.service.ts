import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cuestionario } from '../models/cuestionario';

@Injectable({
  providedIn: 'root',
})
export class CuestionarioService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/cuestionario`;

  uaa: number = this.authservice.obtenerUaa();
  userLogeado: String = this.authservice.user.username;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  find(): Observable<Cuestionario[]> {
    return this.http.get<Cuestionario[]>(`${this.url}/find/${this.uaa}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  findbyCodigo(codigo: number): Observable<Cuestionario> {
    return this.http.get<Cuestionario>(`${this.url}/find-codigo/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  create(cuestionario: Cuestionario): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      cuestionario,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  update(cuestionario: Cuestionario): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      cuestionario,
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
