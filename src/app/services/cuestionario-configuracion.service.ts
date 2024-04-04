import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CuestionarioConfiguracion } from '../models/cuestionario-configuracion';

@Injectable({
  providedIn: 'root',
})
export class CuestionarioConfiguracionService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/cuestionario-c`;

  uaa: number = this.authservice.obtenerUaa();
  userLogeado: String = this.authservice.user.username;
  role: any = this.authservice.user.roles;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  find(): Observable<CuestionarioConfiguracion[]> {
    console.log(this.role[0]);
    
    if (this.role[0] == 'ROLE_ENCUESTAS_SUPER_ADMINISTRADOR') {
      return this.http.get<CuestionarioConfiguracion[]>(
        `${this.url}/buscar-configuraciones`,
        { headers: this.aggAutorizacionHeader() }
      );
    } else {
      return this.http.get<CuestionarioConfiguracion[]>(
        `${this.url}/find/${this.uaa}`,
        { headers: this.aggAutorizacionHeader() }
      );
    }
  }

  findbyCodigo(codigo: number): Observable<CuestionarioConfiguracion[]> {
    return this.http.get<CuestionarioConfiguracion[]>(
      `${this.url}/find-codigo/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  create(cuestionarioC: CuestionarioConfiguracion): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      cuestionarioC,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  update(cuestionarioC: CuestionarioConfiguracion): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update/${this.userLogeado}`,
      cuestionarioC,
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
