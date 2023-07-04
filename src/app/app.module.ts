import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { CuestionarioComponent, ModalCuestionarioInformacion } from './components/cuestionarios/cuestionario/cuestionario.component';
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
    FiltronombreprogramaPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModules,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ModalCuestionarioInformacion,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
