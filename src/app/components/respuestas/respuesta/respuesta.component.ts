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
import { RespuestaOpciones } from 'src/app/models/respuesta-opciones';
import { AuthService } from 'src/app/services/auth.service';
import { RespuestaOpcionesService } from 'src/app/services/respuesta-opciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.css'],
})
export class RespuestaComponent implements OnInit {
  editar: boolean = false;
  form!: FormGroup;

  dataSource = new MatTableDataSource<RespuestaOpciones>([]);

  displayedColumns: string[] = ['codigo', 'descripcion', 'editar'];

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private ropService: RespuestaOpcionesService,
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
      this.find();
      this.initForm();
    }
  }

  scroll(page: HTMLElement) {
    page.scrollIntoView();
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
    this.ropService.find().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<RespuestaOpciones>(data);

        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      },
      (err) => this.fError(err)
    );
  }

  private initForm(): void {
    this.form = this.fb.group({
      descripcion: new FormControl('', Validators.required),
      codigo: new FormControl(''),
    });
  }

  onEditarClick(element: RespuestaOpciones) {
    this.editar = true;
    this.form.get('codigo')!.setValue(element.codigo);
    this.form.get('descripcion')!.setValue(element.descripcion);
  }

  onCrear(): void {
    let rop: RespuestaOpciones = new RespuestaOpciones();
    rop.descripcion = this.form.get('descripcion')!.value;
    rop.codigo = this.form.get('codigo')!.value;

    if (!this.editar) {
      this.resgistrar(rop);
      this.find();
    } else {
      this.actualizar(rop);

      this.find();
    }
  }

  actualizar(rop: RespuestaOpciones) {
    this.ropService.update(rop).subscribe(
      (data) => {
        this.mensajeSuccses();
        this.find();
        this.onCancelar();
      },
      (err) => this.fError(err)
    );
  }

  resgistrar(rop: RespuestaOpciones) {
    this.ropService.create(rop).subscribe(
      (data) => {
        this.find();
        this.mensajeSuccses();
        this.onCancelar();
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

  onEliminar() {
    let codigo = this.form.get('codigo')!.value;
    this.ropService.delete(codigo).subscribe(
      (data) => {
        this.mensajeSuccses();
        this.onCancelar();
        this.find();
      },
      (err) => this.fError(err)
    );
  }
}
