import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CuestionariosComponent } from './components/inicio/cuestionarios/cuestionarios.component';
import { PreguntasComponent } from './components/inicio/preguntas/preguntas.component';
import { ReportesComponent } from './components/inicio/reportes/reportes.component';
import { CuestionarioComponent } from './components/cuestionarios/cuestionario/cuestionario.component';
import { ConfiguracionComponent } from './components/cuestionarios/configuracion/configuracion.component';
import { PrevisualizacionComponent } from './components/cuestionarios/previsualizacion/previsualizacion.component';
import { RespuestaComponent } from './components/respuestas/respuesta/respuesta.component';
import { PreguntaComponent } from './components/preguntas/pregunta/pregunta.component';
import { EscalaLikertComponent } from './components/preguntas/escala-likert/escala-likert.component';
import { GrupoLikertComponent } from './components/preguntas/grupo-likert/grupo-likert.component';
import { ResultadosComponent } from './components/reportes/resultados/resultados.component';
import { DescargablesComponent } from './components/reportes/descargables/descargables.component';
import { RelacionPreguntaRespuestaComponent } from './components/relacion-pregunta-respuesta/relacion-pregunta-respuesta.component';
import { AgrupadoComponent } from './components/reportes/agrupado/agrupado.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'acceso-denegado', component: NotfoundComponent },

  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },

  {
    path: 'cuestionarios',
    component: CuestionariosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cuestionario',
    component: CuestionarioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'previsualizacion',
    component: PrevisualizacionComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'preguntas',
    component: PreguntasComponent,
    canActivate: [AuthGuard],
  },
  { path: 'pregunta', component: PreguntaComponent, canActivate: [AuthGuard] },
  {
    path: 'escala-likert',
    component: EscalaLikertComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-likert',
    component: GrupoLikertComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'respuesta',
    component: RespuestaComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'relacion-pregunta-respuesta',
    component: RelacionPreguntaRespuestaComponent,
    canActivate: [AuthGuard],
  },

  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard] },
  {
    path: 'resultados',
    component: ResultadosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'descargables',
    component: DescargablesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'agrupados', component: AgrupadoComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'acceso-denegado' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
