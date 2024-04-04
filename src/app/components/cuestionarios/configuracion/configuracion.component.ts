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
import { Uaa } from 'src/app/models/uaa';
import { UaaTipo } from 'src/app/models/uaa-tipo';
import { UsuarioTipo } from 'src/app/models/usuario-tipo';
import { Vinculo } from 'src/app/models/vinculo';
import { CuestionarioConfiguracion } from 'src/app/models/cuestionario-configuracion';
import { AuthService } from 'src/app/services/auth.service';
import { UaaService } from 'src/app/services/uaa.service';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { CuestionarioConfiguracionService } from 'src/app/services/cuestionario-configuracion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {
  lstUaaTipo!: UaaTipo[];
  lstflag = false;
  lstUaa!: Uaa[];
  lstCuestionario!: Cuestionario[];
  lstUsuarioTipo!: UsuarioTipo[];
  lstVinculo!: Vinculo[];
  flag: boolean = false;

  editar: boolean = false;

  form!: FormGroup;

  dataSource = new MatTableDataSource<CuestionarioConfiguracion>([]);

  displayedColumns: string[] = [
    'codigo',
    'uaa',
    'cue',
    'registro',
    'tus',
    'vinculo',
    'editar',
  ];

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  constructor(
    private cueAService: CuestionarioConfiguracionService,
    private uaaService: UaaService,
    private fb: FormBuilder,
    private cueService: CuestionarioService,
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
      this.findTipo();
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
    this.cueAService.find().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource<CuestionarioConfiguracion>(
          data
        );

        this.paginator.firstPage();

        this.dataSource.paginator = this.paginator;
      },
      (err) => this.fError(err)
    );
    this.cueService.find().subscribe(
      (data) => {
        this.lstCuestionario = data;
      },
      (err) => this.fError(err)
    );
  }

  onUaa() {
    this.lstflag = true;
    this.uaaService.find(this.form.get('uat')!.value).subscribe(
      (data) => {
        this.lstUaa = data;
      },
      (err) => this.fError(err)
    );
  }

  private initForm(): void {
    this.form = this.fb.group({
      cue: new FormControl('', Validators.required),
      uaa: new FormControl(''),
      codigo: new FormControl(''),
      uat: new FormControl(''),
      tus: new FormControl('', Validators.required),
      vin: new FormControl(''),
    });
  }

  findTipo() {
    this.uaaService.findUat().subscribe(
      (data) => {
        this.lstUaaTipo = data;
      },
      (err) => this.fError(err)
    );
    this.uaaService.findTus().subscribe(
      (data) => {
        this.lstUsuarioTipo = data;
      },
      (err) => this.fError(err)
    );

    this.uaaService.finVin().subscribe((data) => {
      this.lstVinculo = data;
    });
  }

  onEliminar() {
    let codigo = this.form.get('codigo')!.value;
    this.cueAService.delete(codigo).subscribe(
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

  onCrear(): void {
    let tus: UsuarioTipo = new UsuarioTipo();
    tus.codigo = this.form.get('tus')!.value;

    let uaa: Uaa = new Uaa();
    uaa.codigo = this.form.get('uaa')!.value;

    let cue: Cuestionario = new Cuestionario();
    cue.codigo = this.form.get('cue')!.value;

    let vin: Vinculo = new Vinculo();
    vin.codigo = this.form.get('vin')!.value;
    if (vin.codigo < 0) {
      //vin = null;
    }

    let cua: CuestionarioConfiguracion = new CuestionarioConfiguracion();
    cua.codigo = this.form.get('codigo')!.value;
    cua.vinculo = vin;
    cua.cuestionario = cue;
    cua.uaa = uaa;
    cua.usuarioTipo = tus;

    if (!this.editar) {
      this.resgistrar(cua);

      this.onCancelar();
      this.find();
    } else {
      this.actualizar(cua);
      this.onCancelar();
      this.find();
    }
  }

  onUaaNull() {
    this.lstflag = false;
    this.form.get('uaa')!.setValue(null);
  }

  actualizar(cua: CuestionarioConfiguracion) {
    this.cueAService.update(cua).subscribe(
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

  resgistrar(cua: CuestionarioConfiguracion) {
    this.cueAService.create(cua).subscribe(
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

  onEditarClick(element: CuestionarioConfiguracion) {
    this.editar = true;
    this.form.get('codigo')!.setValue(element.codigo);
    this.form.get('cue')!.setValue(element.cuestionario.codigo);
    this.form.get('tus')!.setValue(element.usuarioTipo.codigo);

    if (element.vinculo.codigo != 0 || element.vinculo.codigo != null) {
      this.onVin();
      this.form.get('vin')!.setValue(element.vinculo.codigo);
    } else {
      this.form.get('vin')!.setValue(null);
      this.flag = false;
    }

    if (element.uaa.codigo > 0) {
      this.uaaService.findCodigo(element.uaa.codigo).subscribe(
        (data) => {
          this.form.get('uat')!.setValue(data.uaaTipo.codigo);
          this.onUaa();
          this.form.get('uaa')!.setValue(element.uaa.codigo);
        },
        (err) => this.fError(err)
      );
    }
  }

  onCancelar() {
    this.flag = false;
    this.form.reset();
    this.editar = false;
  }

  onVin() {
    if (this.form.get('tus')!.value == 3) {
      this.flag = true;
    } else {
      this.flag = false;
    }
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
