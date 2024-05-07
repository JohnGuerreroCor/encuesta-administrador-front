import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './components/inicio/inicio.component';
import { TokenComponent } from './components/token/token.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { CuestionariosComponent } from './components/inicio/cuestionarios/cuestionarios.component';
import { PreguntasComponent } from './components/inicio/preguntas/preguntas.component';
import { ReportesComponent } from './components/inicio/reportes/reportes.component';
import {
  CuestionarioComponent,
  ModalCuestionarioInformacion,
} from './components/cuestionarios/cuestionario/cuestionario.component';
import { ConfiguracionComponent } from './components/cuestionarios/configuracion/configuracion.component';
import { PrevisualizacionComponent } from './components/cuestionarios/previsualizacion/previsualizacion.component';
import { PreguntaComponent } from './components/preguntas/pregunta/pregunta.component';
import { EscalaLikertComponent } from './components/preguntas/escala-likert/escala-likert.component';
import { GrupoLikertComponent } from './components/preguntas/grupo-likert/grupo-likert.component';
import { RespuestaComponent } from './components/respuestas/respuesta/respuesta.component';
import { ResultadosComponent } from './components/reportes/resultados/resultados.component';
import { DescargablesComponent } from './components/reportes/descargables/descargables.component';
import { RelacionPreguntaRespuestaComponent } from './components/relacion-pregunta-respuesta/relacion-pregunta-respuesta.component';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { FiltrofacultadPipe } from './pipes/filtrofacultad.pipe';
import { FiltronombreprogramaPipe } from './pipes/filtronombreprograma.pipe';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { FusionChartsModule } from 'angular-fusioncharts';

import {NgxPrintModule} from 'ngx-print';


// Load FusionCharts
import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load fusion theme
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { AgrupadoComponent } from './components/reportes/agrupado/agrupado.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    TokenComponent,
    NavbarComponent,
    LoginComponent,
    CuestionariosComponent,
    PreguntasComponent,
    ReportesComponent,
    CuestionarioComponent,
    ModalCuestionarioInformacion,
    ConfiguracionComponent,
    PrevisualizacionComponent,
    PreguntaComponent,
    EscalaLikertComponent,
    GrupoLikertComponent,
    RespuestaComponent,
    ResultadosComponent,
    DescargablesComponent,
    RelacionPreguntaRespuestaComponent,
    CapitalizeFirstLetterPipe,
    FiltrofacultadPipe,
    FiltronombreprogramaPipe,
    AgrupadoComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModules,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FusionChartsModule,
    NgxPrintModule,
  ],
  entryComponents: [ModalCuestionarioInformacion],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  bootstrap: [AppComponent],
})
export class AppModule {}
