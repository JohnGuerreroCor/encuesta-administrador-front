import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Cuestionario } from 'src/app/models/cuestionario';
import { Pregunta } from 'src/app/models/pregunta';
import { PreguntaRespuestas } from 'src/app/models/pregunta-respuestas';
import { RespuestaOpciones } from 'src/app/models/respuesta-opciones';
import { TipoRespuesta } from 'src/app/models/tipo-respuesta';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { PreguntaRespuestaService } from 'src/app/services/pregunta-respuesta.service';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { RespuestaOpcionesService } from 'src/app/services/respuesta-opciones.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relacion-pregunta-respuesta',
  templateUrl: './relacion-pregunta-respuesta.component.html',
  styleUrls: ['./relacion-pregunta-respuesta.component.css'],
})
export class RelacionPreguntaRespuestaComponent implements OnInit {
  editar2: boolean = false;

  lstCuestionario!: Cuestionario[];
  lstPregunta!: Pregunta[];
  lstRespuesta!: RespuestaOpciones[];

  flag: boolean = false;

  editar: boolean = false;

  form!: FormGroup;
  form2!: FormGroup;
  validador: boolean = false;

  dataSource = new MatTableDataSource<PreguntaRespuestas>([]);

  displayedColumns: string[] = ['codigo', 'pre', 'rop', 'editar'];

  /* displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'rop',
    'pre',
    'depende',
    'tre',
    'editar',
    'agg',
  ]; */

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(
    private prService: PreguntaRespuestaService,
    private cueService: CuestionarioService,
    private fb: FormBuilder,
    private preService: PreguntaService,
    private reService: RespuestaOpcionesService,
    private auth: AuthService,
    private router: Router
  ) {}

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  scroll(page: HTMLElement) {
    page.scrollIntoView();
  }

  ngOnInit() {
    if (this.auth.validacionToken()) {
      this.findCuestionarios();
      this.initForm();
    }
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (arr[0] == 'Access token expired') {
      this.auth.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }

  up() {
    window.scroll(0, 0);
  }

  findCuestionarios() {
    this.cueService.find().subscribe(
      (data) => {
        this.lstCuestionario = data;
      },
      (err) => this.fError(err)
    );
  }

  find() {
    this.prService.findbyCuestionario(this.form2.get('cue')!.value).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<PreguntaRespuestas>(data);

        this.paginator.firstPage();

        this.dataSource.paginator = this.paginator;
      },
      (err) => this.fError(err)
    );
    this.reService.find().subscribe(
      (data) => {
        this.lstRespuesta = data;
      },
      (err) => this.fError(err)
    );
  }

  findPreguntas() {
    this.preService.findbyCuestAndRYS(this.form2.get('cue')!.value).subscribe(
      (data) => {
        this.lstPregunta = data;
      },
      (err) => this.fError(err)
    );
  }

  private initForm(): void {
    this.form2 = this.fb.group({
      cue: new FormControl(''),
    });
    this.form = this.fb.group({
      pre: new FormControl('', Validators.required),
      re: new FormControl(''),
      descripcion: new FormControl(''),
      codigo: new FormControl(''),
      depende: new FormControl(''),
      tre: new FormControl(''),
    });
  }

  mostrar() {
    this.find();
    this.findPreguntas();
    this.flag = true;
  }

  onEliminar() {
    let codigo = this.form.get('codigo')!.value;
    this.prService.delete(codigo).subscribe(
      (data) => {
        if (data > 0) {
          this.mensajeSuccses();
          this.find();
          this.onCancelar();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  ontre() {
    this.preService.findbyCodigo(this.form.get('pre')!.value).subscribe(
      (data) => {
        this.form.get('tre')!.setValue(data.tipoRespuesta.codigo);
      },
      (err) => this.fError(err)
    );
  }

  onCrear(): void {
    let pre: Pregunta = new Pregunta();
    pre.codigo = this.form.get('pre')!.value;

    let tre: TipoRespuesta = new TipoRespuesta();
    tre.codigo = this.form.get('tre')!.value;

    let rop: RespuestaOpciones = new RespuestaOpciones();
    rop.codigo = this.form.get('re')!.value;

    let prr: PreguntaRespuestas = new PreguntaRespuestas();
    prr.codigo = this.form.get('codigo')!.value;
    prr.depende = this.form.get('depende')!.value;
    prr.descripcionAdicional = this.form.get('descripcion')!.value;

    prr.pregunta = pre;
    prr.respuestaOpciones = rop;
    prr.tipoRespuestas = tre;

    if (!this.editar) {
      this.resgistrar(prr);

      this.onCancelar();
      this.find();
    } else {
      this.actualizar(prr);
      this.onCancelar();
      this.find();
    }
  }

  actualizar(prr: PreguntaRespuestas) {
    this.prService.update(prr).subscribe(
      (data) => {
        if (data > 0) {
          this.mensajeSuccses();
          this.find();
          this.onCancelar();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  resgistrar(prr: PreguntaRespuestas) {
    this.prService.create(prr).subscribe(
      (data) => {
        if (data > 0) {
          this.mensajeSuccses();
          this.find();
          this.onCancelar();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  onCancelar() {
    this.form.reset();
    this.editar = false;
    this.editar2 = false;
    this.form.get('depende')!.clearValidators();
    this.form.get('descripcion')!.clearValidators();
    this.form.get('descripcion')!.updateValueAndValidity();
    this.form.get('depende')!.updateValueAndValidity();
  }

  onEditarClick(element: PreguntaRespuestas) {
    this.up();
    this.editar = true;
    this.form.get('codigo')!.setValue(element.codigo);

    this.preService.findbyCodigo(element.pregunta.codigo).subscribe(
      (data) => {
        this.form.get('tre')!.setValue(data.tipoRespuesta.codigo);
      },
      (err) => this.fError(err)
    );

    this.form.get('pre')!.setValue(element.pregunta.codigo);
    this.form.get('re')!.setValue(element.respuestaOpciones.codigo);
  }

  onEditaragregar(element: PreguntaRespuestas) {
    this.editar2 = true;
    this.editar = true;
    this.form.get('depende')!.setValue(element.depende);
    this.form.get('descripcion')!.setValue(element.descripcionAdicional);
    this.onEditarClick(element);
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrio Un Error!',
    });
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
