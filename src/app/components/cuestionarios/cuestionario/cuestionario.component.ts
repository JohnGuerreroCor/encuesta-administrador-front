import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Cuestionario } from 'src/app/models/cuestionario';
import { Uaa } from 'src/app/models/uaa';
import { UaaTipo } from 'src/app/models/uaa-tipo';
import { AuthService } from 'src/app/services/auth.service';
import { UaaService } from 'src/app/services/uaa.service';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css'],
})
export class CuestionarioComponent implements OnInit {
  editar: boolean = false;

  form!: FormGroup;

  lstUaaTipo!: UaaTipo[];
  lstflag = false;
  lstUaa!: Uaa[];

  date = new Date();
  hoy: Date = new Date();

  dataSource = new MatTableDataSource<Cuestionario>([]);

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'uaa',
    'fin',
    'instrucciones',
    'editar',
  ];

  fechaLimiteMinima!: any;
  fechaLimiteMinimaVigencia!: any;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private cuestionarioService: CuestionarioService,
    private fb: FormBuilder,
    private uaaService: UaaService,
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog
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
      this.find();
      this.initForm();
      this.findTipo();
      this.fechaLimiteMinima = new Date();
    }
  }

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = new Date(
      this.form.get('fechaInicio')!.value
    );
  }

  validarFechas(cue: Cuestionario): boolean {
    let date = new Date(cue.fin);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);

    if (this.date < date) {
      return true;
    } else {
      return false;
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

  find() {
    this.cuestionarioService.find().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<Cuestionario>(data);

        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      },
      (err) => this.fError(err)
    );
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: new FormControl('', Validators.required),
      instrucciones: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaVigencia: new FormControl('', Validators.required),
      codigo: new FormControl(''),
    });
  }

  onEditarClick(element: Cuestionario) {
    this.editar = true;
    this.form.get('codigo')!.setValue(element.codigo);
    this.form.get('nombre')!.setValue(element.nombre);
    this.form.get('instrucciones')!.setValue(element.instrucciones);
    let fechaInicio = new Date(element.inicio + ' 0:00:00');
    this.form.get('fechaInicio')!.setValue(fechaInicio);
    let fechaFin = new Date(element.fin + ' 0:00:00');
    this.form.get('fechaVigencia')!.setValue(fechaFin);
  }

  onCrear(): void {
    let uaa: Uaa = new Uaa();
    uaa.codigo = this.auth.obtenerUaa();

    let cuestionario: Cuestionario = new Cuestionario();
    cuestionario.uaa = uaa;
    cuestionario.codigo = this.form.get('codigo')!.value;
    cuestionario.nombre = this.form.get('nombre')!.value;
    cuestionario.instrucciones = this.form.get('instrucciones')!.value;
    cuestionario.inicio = this.form.get('fechaInicio')!.value;
    cuestionario.fin = this.form.get('fechaVigencia')!.value;

    if (!this.editar) {
      this.resgistrar(cuestionario);

      this.onCancelar();
      this.find();
    } else {
      this.actualizar(cuestionario);
      this.onCancelar();
      this.find();
    }
  }

  resgistrar(cuestionario: Cuestionario) {
    this.cuestionarioService.create(cuestionario).subscribe(
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

  actualizar(cuestionario: Cuestionario) {
    this.cuestionarioService.update(cuestionario).subscribe(
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

  onEliminar() {
    let codigo = this.form.get('codigo')!.value;
    this.cuestionarioService.delete(codigo).subscribe(
      (data) => {
        if (data > 0) {
          this.mensajeSuccses();
          this.onCancelar();
          this.find();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  findTipo() {
    this.uaaService.findTipo().subscribe(
      (data) => {
        this.lstUaaTipo = data;
      },
      (err) => this.fError(err)
    );
  }

  onCancelar() {
    this.form.reset();
    this.editar = false;
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

  openDialog(element: Cuestionario): void {
    const dialogRef = this.dialog.open(ModalCuestionarioInformacion, {
      data: element,
    });
  }
}

//MODAL
@Component({
  selector: 'modal-cuestionario-informacion',
  templateUrl: 'modal-cuestionario-informacion.html',
  styleUrls: ['./cuestionario.component.css'],
})
export class ModalCuestionarioInformacion {
  constructor(
    public dialogRef: MatDialogRef<ModalCuestionarioInformacion>,
    @Inject(MAT_DIALOG_DATA) public data: Cuestionario
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
