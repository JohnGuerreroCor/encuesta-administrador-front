import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { GrupoEscala } from '../models/grupo-escala';

@Injectable({
  providedIn: 'root',
})
export class GrupoEscalaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/grupo-escala`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  userLogeado: String = this.authservice.user.username;
  find(): Observable<GrupoEscala[]> {
    return this.http.get<GrupoEscala[]>(`${this.url}/find`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  create(gre: GrupoEscala): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      gre,
      { headers: this.aggAutorizacionHeader() }
    );
  }
  update(gre: GrupoEscala): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      gre,
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
