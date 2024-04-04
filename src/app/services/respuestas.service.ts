import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Respuesta } from '../models/respuesta';
import { DatosGraficaPreguntaPrincipal } from '../models/datos-grafica-pregunta-principal';
import { Pregunta } from '../models/pregunta';
import { ReporteAgrupado } from '../models/reporte-agrupado';
import { Resultados } from '../models/resultados';

@Injectable({
  providedIn: 'root',
})
export class RespuestasService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/respuesta`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  userLogeado: String = this.authservice.user.username;

  uaa: number = this.authservice.obtenerUaa(); //385

  // GENERAR REPORTES AGRUPADOS

  obtenerPreguntasOpciones(cuestionario: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(
      `${this.url}/obtener-preguntas-opciones/${cuestionario}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerPreguntasTexto(cuestionario: number): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(
      `${this.url}/obtener-preguntas-texto/${cuestionario}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  generarReporteAgrupadoTexto(
    cuestionario: number,
    preguntas: string
  ): Observable<ReporteAgrupado[]> {
    return this.http.get<ReporteAgrupado[]>(
      `${this.url}/generar-reporte-agrupado-texto/${cuestionario}/${preguntas}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  generarReporteAgrupadoOpciones(
    cuestionario: number,
    preguntas: string
  ): Observable<ReporteAgrupado[]> {
    return this.http.get<ReporteAgrupado[]>(
      `${this.url}/generar-reporte-agrupado-opciones/${cuestionario}/${preguntas}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  // GENERAL ACREDITACION

  generarExcel(titulo: string): Observable<any> {
    return this.http.get<any>(`${this.url}/reporte/${this.uaa}/${titulo}`, {
      headers: this.aggAutorizacionHeader(),
      responseType: 'blob' as 'json',
    });
  }

  generarExcelPorCuestionario(
    titulo: string,
    cuestionario: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-c/${titulo}/${cuestionario}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  generarExcelPorUsuarioTipo(titulo: string, tus: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-tus/${this.uaa}/${titulo}/${tus}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  generarExcelPorPrograma(programa: number, titulo: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-p/${programa}/${this.uaa}/${titulo}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  // DETALLADO

  generarExcelDetallado(titulo: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-detallado/${this.uaa}/${titulo}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  generarExcelPorCuestionarioDetallado(
    titulo: string,
    cuestionario: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-c-detallado/${titulo}/${cuestionario}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  generarExcelPorUsuarioTipoDetallado(
    titulo: string,
    tus: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-tus-detallado/${this.uaa}/${titulo}/${tus}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  generarExcelPorProgramaDetallado(
    programa: number,
    titulo: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/reporte-p-detallado/${programa}/${this.uaa}/${titulo}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  find(): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(`${this.url}/find`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  generarDatosGrafica(
    cuestionario: number
  ): Observable<DatosGraficaPreguntaPrincipal[]> {
    return this.http.get<DatosGraficaPreguntaPrincipal[]>(
      `${this.url}/grafica-principal/${cuestionario}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  findbyCodigo(codigo: number): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(`${this.url}/find/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  create(respuesta: Respuesta): Observable<number> {
    return this.http.post<number>(
      `${this.url}/create/${this.userLogeado}`,
      respuesta,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  update(respuesta: Respuesta): Observable<number> {
    return this.http.put<number>(
      `${this.url}/update /${this.userLogeado}`,
      respuesta,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  delete(codigo: number): Observable<number> {
    return this.http.put<number>(
      `${this.url}/remove/${codigo} /${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerResultados(cuestionario: number): Observable<Resultados[]> {
    return this.http.get<Resultados[]>(
      `${this.url}/obtener-resultados/${cuestionario}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }
}
