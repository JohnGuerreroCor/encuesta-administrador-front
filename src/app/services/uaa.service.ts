import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Uaa } from '../models/uaa';
import { UaaTipo } from '../models/uaa-tipo';
import { UsuarioTipo } from '../models/usuario-tipo';
import { Vinculo } from '../models/vinculo';

@Injectable({
  providedIn: 'root',
})
export class UaaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/uaa`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  find(codigo: number): Observable<Uaa[]> {
    return this.http.get<Uaa[]>(`${this.url}/find/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findTipo(): Observable<UaaTipo[]> {
    return this.http.get<UaaTipo[]>(`${this.url}/find-tipo`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findCodigo(codigo: number): Observable<Uaa> {
    return this.http.get<Uaa>(`${this.url}/find-codigo/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findTus(): Observable<UsuarioTipo[]> {
    return this.http.get<UsuarioTipo[]>(`${this.url}/find-tus`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  findUat(): Observable<UaaTipo[]> {
    return this.http.get<UaaTipo[]>(`${this.url}/find-uat`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
  finVin(): Observable<Vinculo[]> {
    return this.http.get<Vinculo[]>(`${this.url}/find-vin`, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
