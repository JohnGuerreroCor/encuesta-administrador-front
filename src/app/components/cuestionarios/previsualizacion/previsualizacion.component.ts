import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Cuestionario } from 'src/app/models/cuestionario';
import { CuestionarioConfiguracion } from 'src/app/models/cuestionario-configuracion';
import { Escala } from 'src/app/models/escala';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaRespuestas } from 'src/app/models/pregunta-respuestas';
import { CuestionarioConfiguracionService } from 'src/app/services/cuestionario-configuracion.service';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { EscalaService } from 'src/app/services/escala.service';
import { PreguntaRespuestaService } from 'src/app/services/pregunta-respuesta.service';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-previsualizacion',
  templateUrl: './previsualizacion.component.html',
  styleUrls: ['./previsualizacion.component.css'],
})
export class PrevisualizacionComponent implements OnInit {
  lstOpciones: Array<PreguntaRespuestas[]> = new Array();
  lstPreguntass!: Pregunta[];
  lstCuestionarios!: Cuestionario[];
  form!: FormGroup;
  flag: boolean = false;
  titulo!: string;
  instrucciones!: string;
  dirigido!: string;
  lstRespuestas: Array<PreguntaRespuestas[]> = new Array();
  contador: number = 0;
  lstEscala: Array<Escala[]> = new Array();
  lstSubPreguntas: Array<Pregunta[]> = new Array();
  lstConfig!: CuestionarioConfiguracion[];
  validador: boolean = false;

  constructor(
    private cuestionarioService: CuestionarioService,
    private fb: FormBuilder,
    private preguntaService: PreguntaService,
    private escalaService: EscalaService,
    private cuaService: CuestionarioConfiguracionService,
    private prService: PreguntaRespuestaService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.auth.validacionToken()) {
      this.initForm();
      this.findCuestionarios();
    }
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (arr[0] == 'Access token expired') {
      this.auth.logout();
      this.router.navigate(['login']);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      codigo: new FormControl('', Validators.required),
    });
  }

  findCuestionarios() {
    this.cuestionarioService.find().subscribe(
      (data) => {
        this.lstCuestionarios = data;
      },
      (err) => this.fError(err)
    );
  }

  onMostrar() {
    this.cuestionarioService
      .findbyCodigo(this.form.get('codigo')!.value)
      .subscribe(
        (data) => {
          this.flag = true;
          this.titulo = data.nombre;
          this.instrucciones = data.instrucciones;
          this.listarPreguntasporCuestionario();
        },
        (err) => this.fError(err)
      );

    this.cuaService
      .findbyCodigo(this.form.get('codigo')!.value)
      .subscribe((data) => {
        this.lstConfig = data;
        let au: string = '';
        let tu: string = '';

        for (const i of this.lstConfig) {
          if (i.uaa.nombre != null) {
            au = au + ', ' + i.uaa.nombre;
          }
          if (i.usuarioTipo.nombre != null) {
            tu = tu + ', ' + i.usuarioTipo.nombre;
          }
        }
        this.validacionArregloDependencias(au, tu);

        //this.dirigido = data.usuarioTipo.nombre + "," + data.uaa.nombre + "";
      });
  }

  validacionArregloDependencias(au: any, tu: any) {
    let arau: string[] = au.split(',');
    let artu: string[] = tu.split(',');
    let arru = arau.filter(this.onlyUnique);
    let arrtu = artu.filter(this.onlyUnique);

    this.dirigido = arru.toString() + ' ' + arrtu.toString();
  }

  onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index ? value : '';
  }

  listarPreguntasporCuestionario() {
    this.preguntaService.findbyCues(this.form.get('codigo')!.value).subscribe(
      (data) => {
        this.lstPreguntass = data;
        for (const e of data) {
          if (e.tipo == 2) {
            this.preguntaService
              .findbyDependencia(e.codigo)
              .subscribe((data) => {
                this.lstSubPreguntas.push(data);
                this.lstSubPreguntas[e.codigo] = data;
              });

            this.escalaService.find(e.gre.codigo).subscribe((data) => {
              this.lstEscala.push(data);
              this.lstEscala[e.codigo] = data;
            });
          } else {
            this.prService.findByPregunta(e.codigo).subscribe((data) => {
              this.lstOpciones.push(data);
              this.lstOpciones[e.codigo] = data;
            });
          }
        }
        this.funcion();
      },
      (err) => this.fError(err)
    );
  }

  // hacer funcion que devuelva un true or false para las preguntas y de paso llene la lista de opciones
  funcion() {
    for (let index = 0; index < this.lstPreguntass.length; index++) {
      this.prService
        .findByPregunta(this.lstPreguntass[index].codigo)
        .subscribe((data) => {
          this.lstRespuestas.push(data);

          this.lstRespuestas[index] = data;
        });
    }
    // this.listarPreguntasporCuestionario();
  }
}
