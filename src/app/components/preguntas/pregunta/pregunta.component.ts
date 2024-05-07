import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Cuestionario } from 'src/app/models/cuestionario';
import { GrupoEscala } from 'src/app/models/grupo-escala';
import { TipoRespuesta } from 'src/app/models/tipo-respuesta';
import { AuthService } from 'src/app/services/auth.service';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { GrupoEscalaService } from 'src/app/services/grupo-escala.service';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { TipoRespuestaService } from 'src/app/services/tipo-respuesta.service';
import { Pregunta } from 'src/app/models/pregunta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css'],
})
export class PreguntaComponent implements OnInit {
  isChecked = true;
  editar: boolean = false;
  cueVerificacion: boolean = false;
  depende: boolean = false;
  gre: boolean = false;
  lstGre!: GrupoEscala[];

  lstTipoRespuesta!: TipoRespuesta[];
  lstCuestionario!: Cuestionario[];
  lstPreguntas!: Pregunta[];

  form!: FormGroup;
  form2!: FormGroup;

  validador: boolean = false;

  //Tabla

  dataSource = new MatTableDataSource<Pregunta>([]);

  displayedColumns: string[] = [
    'codigo',
    'id',
    'descripcion',
    'textoAdicional',
    'tipoRespuesta',
    'cuestionario',
    'obligatorio',
    'editar',
  ];

  //Paginador

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(
    private preguntaService: PreguntaService,
    private tipoRespuestaService: TipoRespuestaService,
    private fb: FormBuilder,
    private cueService: CuestionarioService,
    private greService: GrupoEscalaService,
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

  ngOnInit() {
    if (this.auth.validacionToken()) {
      this.listarTipoRespuestas();
      this.initForm();
      this.listarCuestionario();
    }
    //this.find();
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

  private initForm(): void {
    this.form = this.fb.group({
      descripcion: new FormControl('', Validators.required),
      texto: new FormControl(''),
      trespuesta: new FormControl('', Validators.required),
      tipo: new FormControl(''),
      codigo: new FormControl(''),
      grup: new FormControl(''),
      obligatorio: new FormControl(''),
      depende: new FormControl(''),
      id: new FormControl(''),
    });
    this.form2 = this.fb.group({
      cuestionario: new FormControl('', Validators.required),
    });
  }

  onEditarClick(element: Pregunta) {
    let ob: boolean;
    if (element.obligatorio == 1) {
      ob = true;
    } else {
      ob = false;
    }
    this.editar = true;
    this.form.get('codigo')!.setValue(element.codigo);
    this.form.get('descripcion')!.setValue(element.descripcion);
    this.form.get('texto')!.setValue(element.textoAdicional);
    this.form.get('trespuesta')!.setValue(element.tipoRespuesta.codigo);
    this.form.get('tipo')!.setValue(element.tipo);
    this.form2.get('cuestionario')!.setValue(element.cuestionario.codigo);
    this.form.get('obligatorio')!.setValue(ob);
    this.form.get('grup')!.setValue(element.gre.codigo);
    this.form.get('id')!.setValue(element.identificador);
  }

  scroll(page: HTMLElement): void {
    page.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  listarTipoRespuestas() {
    this.tipoRespuestaService.find().subscribe(
      (data) => {
        this.lstTipoRespuesta = data;
      },
      (err) => this.fError(err)
    );
  }

  listarCuestionario() {
    this.cueService.find().subscribe(
      (data) => {
        this.lstCuestionario = data;
      },
      (err) => this.fError(err)
    );
    this.greService.find().subscribe(
      (data) => {
        this.lstGre = data;
      },
      (err) => this.fError(err)
    );
  }

  find() {
    this.preguntaService
      .findAdminList(this.form2.get('cuestionario')!.value)
      .subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource<Pregunta>(data);

          this.paginator.firstPage();
          this.dataSource.paginator = this.paginator;
        },
        (err) => this.fError(err)
      );
    this.preguntaService
      .findbyCuest(this.form2.get('cuestionario')!.value)
      .subscribe(
        (data) => {
          this.lstPreguntas = data;
          this.depende = false;
          this.form.get('depende')!.clearValidators();
          this.form.get('depende')!.updateValueAndValidity();
          this.form.get('grup')!.clearValidators();
          this.form.get('grup')!.updateValueAndValidity();
        },
        (err) => this.fError(err)
      );
  }

  onCrear(): void {
    let ob: number;

    if (this.form.get('obligatorio')!.value) {
      ob = 1;
    } else {
      ob = 0;
    }

    let pregunta: Pregunta = new Pregunta();
    let preVlidar: Pregunta = new Pregunta();
    preVlidar.codigo = this.form.get('codigo')!.value;

    let tipoRespuesta: TipoRespuesta = new TipoRespuesta();
    let cue: Cuestionario = new Cuestionario();
    cue.codigo = this.form2.get('cuestionario')!.value;

    let grup: GrupoEscala = new GrupoEscala();
    grup.codigo = this.form.get('grup')!.value;

    tipoRespuesta.codigo = this.form.get('trespuesta')!.value;
    preVlidar.tipoRespuesta = tipoRespuesta;
    preVlidar.descripcion = this.form.get('descripcion')!.value;

    preVlidar.textoAdicional = this.form.get('texto')!.value;
    preVlidar.tipo = this.form.get('tipo')!.value;
    preVlidar.depende = this.form.get('depende')!.value;
    preVlidar.identificador = this.form.get('id')!.value;

    if (preVlidar.textoAdicional == null) {
      //preVlidar.textoAdicional = null;
    }

    if (preVlidar.identificador == null) {
      //preVlidar.identificador = null;
    }
    if (preVlidar.depende == 0 || preVlidar.depende == null) {
      //preVlidar.depende = null;
    }

    preVlidar.obligatorio = ob;
    preVlidar.cuestionario = cue;
    preVlidar.gre = grup;

    pregunta = preVlidar;

    if (!this.editar) {
      this.resgistrar(pregunta);
      this.onCancelar();
      this.find();
    } else {
      this.actualizar(pregunta);

      this.find();
    }
  }

  actualizar(pregunta: Pregunta) {
    this.preguntaService.update(pregunta).subscribe(
      (data) => {
        this.mensajeSuccses();
        this.find();
        this.onCancelar();
      },
      (err) => this.fError(err)
    );
  }

  onCancelar() {
    this.form.reset();
    this.editar = false;
    this.depende = false;
    this.form.get('depende')!.clearValidators();
    this.form.get('depende')!.updateValueAndValidity();
    this.form.get('grup')!.clearValidators();
    this.form.get('grup')!.updateValueAndValidity();
  }

  onEliminar() {
    let codigo = this.form.get('codigo')!.value;
    this.preguntaService.delete(codigo).subscribe(
      (data) => {
        if (data > 0) {
          this.mensajeSuccses();
          this.find();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  resgistrar(pregunta: Pregunta) {
    this.preguntaService.create(pregunta).subscribe(
      (data) => {
        if (data > 0) {
          this.mensajeSuccses();
          this.find();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
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

  onCuest() {
    this.cueVerificacion = true;
    this.find();
  }

  onDependencia() {
    if (this.form.get('tipo')!.value == 1) {
      this.depende = true;
      this.form.get('depende')!.setValidators(Validators.required);
      this.form.get('depende')!.updateValueAndValidity();
    } else {
      this.depende = false;
      this.form.get('depende')!.clearValidators();
      this.form.get('depende')!.updateValueAndValidity();
    }
  }

  onGre() {
    if (this.form.get('tipo')!.value == 2) {
      this.gre = true;
      this.form.get('grup')!.setValidators(Validators.required);
      this.form.get('grup')!.updateValueAndValidity();
    } else {
      this.gre = false;
      this.form.get('grup')!.clearValidators();
      this.form.get('grup')!.updateValueAndValidity();
    }
  }
}
