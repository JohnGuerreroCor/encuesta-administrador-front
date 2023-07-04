import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Escala } from './../models/escala';

@Injectable({
  providedIn: 'root',
})
export class EscalaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/escala`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }
  userLogeado: String = this.authservice.user.username;

  find(codigo: number): Observable<Escala[]> {
    return this.http.get<Escala[]>(`${this.url}/find/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  create(escala: Escala): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      escala,
      { headers: this.aggAutorizacionHeader() }
    );
  }
  update(escala: Escala): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      escala,
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
