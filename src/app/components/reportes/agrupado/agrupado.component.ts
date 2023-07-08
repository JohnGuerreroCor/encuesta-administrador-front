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
import { AuthService } from 'src/app/services/auth.service';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { Cuestionario } from 'src/app/models/cuestionario';
import { UsuarioTipo } from 'src/app/models/usuario-tipo';
import { UaaService } from 'src/app/services/uaa.service';
import { DatosGraficaPreguntaPrincipal } from 'src/app/models/datos-grafica-pregunta-principal';
import { Programa } from 'src/app/models/programa';
import { Sede } from 'src/app/models/sede';
import { Uaa } from 'src/app/models/uaa';
import { ProgramaService } from 'src/app/services/programa.service';
import Swal from 'sweetalert2';
import { Pregunta } from 'src/app/models/pregunta';
import { ReporteAgrupado } from 'src/app/models/reporte-agrupado';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Agrupado {
  columna: any;
}

@Component({
  selector: 'app-agrupado',
  templateUrl: './agrupado.component.html',
  styleUrls: ['./agrupado.component.css'],
})
export class AgrupadoComponent implements OnInit {
  lstTipos: string[] = ['Por cuestionario'];
  lstReporteAgrupado: ReporteAgrupado[] = [];
  dataSource = new MatTableDataSource<ReporteAgrupado>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  form!: FormGroup;
  flag!: number;
  lstCuestionarios!: Cuestionario[];
  lstPreguntas!: Pregunta[];
  lstPreguntasTexto!: any;
  lstPreguntasOpciones!: any;
  lstPreguntasOpcionesDescripcion: any[] = [];
  lstPreguntasTextoDescripcion: any[] = [];
  lstUsuarioTipo!: UsuarioTipo[];
  lstDatosGrafica!: DatosGraficaPreguntaPrincipal[];
  lstUaa!: Uaa[];
  validador: boolean = false;
  vistaPreviaResultados: boolean = true;
  vistaResultados: boolean = false;
  gifUrlLoad =
    'https://www.usco.edu.co/imagen-institucional/logo/precarga-usco.gif';
  gifActivate = false;
  programa: Programa = new Programa();
  sedes!: Sede[];
  programas!: Programa[];
  variable: any;
  ua!: number;
  nombrePro!: string;
  constructor(
    private uaaService: UaaService,
    private auth: AuthService,
    private cuestService: CuestionarioService,
    private respuestaService: RespuestasService,
    private fb: FormBuilder,
    private router: Router,
    private tusService: UaaService,
    public programaService: ProgramaService
  ) {}

  ngOnInit() {
    if (this.auth.validacionToken()) {
      this.find();
      this.initForm();
    }
    this.programaService.getAllProgramas().subscribe((programas) => {
      this.programas = programas;
    });

    this.uaaService.find(1).subscribe(
      (data) => {
        this.lstUaa = data;
      },
      (err) => this.fError(err)
    );
    this.tusService.findCodigo(2).subscribe((data) => {
      this.variable = data;
    });
  }

  setPrograma(val: any) {
    this.form.get('programa')!.setValue(val);
  }

  loadingUsco(url: any) {
    this.gifActivate = true;
    if (url != null) {
      this.gifActivate = false;
      this.validador = false;
      this.vistaPreviaResultados = true;
    }
  }

  find(): void {
    this.cuestService.find().subscribe((data) => {
      this.lstCuestionarios = data;
    });
    this.tusService.findTus().subscribe((data) => {
      this.lstUsuarioTipo = data;
    });
    this.respuestaService.generarDatosGrafica(11).subscribe((data) => {
      this.lstDatosGrafica = data;
    });
  }
  private initForm(): void {
    this.form = this.fb.group({
      titulo: new FormControl('', Validators.required),
      tus: new FormControl(''),
      cuestionario: new FormControl('', Validators.required),
      programa: new FormControl(''),
      uaa: new FormControl(''),
      tipoPregunta: new FormControl('', Validators.required),
    });
  }

  vista() {
    this.validador = false;
    this.lstReporteAgrupado = [];
    this.loadingUsco(null);
    this.vistaPreviaResultados = true;
  }

  obetenerTipoPreguntas() {
    this.validador = false;
    this.loadingUsco(null);
    this.lstPreguntas = [];
    this.lstPreguntasTexto = [];
    this.lstPreguntasOpciones = [];
    this.lstPreguntasOpcionesDescripcion = [];
    this.lstPreguntasTextoDescripcion = [];
    this.lstPreguntas = [];
    this.lstReporteAgrupado = [];
    let auxTexto = '';
    let auxOpciones = '';
    if (this.form.get('tipoPregunta')!.value == 1) {
      this.validador = true;
      this.respuestaService
        .obtenerPreguntasTexto(this.form.get('cuestionario')!.value)
        .subscribe((data) => {
          this.lstPreguntas = data;
          this.lstPreguntas.forEach((e, i) => {
            if (i == 0) {
              auxTexto = '[' + e.codigo + ']';
              this.lstPreguntasTexto = auxTexto;
            } else {
              auxTexto = auxTexto + ',' + '[' + e.codigo + ']';
              this.lstPreguntasTexto = auxTexto;
            }
          });
          this.lstPreguntas.forEach((e, i) => {
            this.lstPreguntasTextoDescripcion.push(e.descripcion);
          });
          this.generarReporteAgrupadoTexto();
        });
    } else {
      this.validador = true;
      this.respuestaService
        .obtenerPreguntasOpciones(this.form.get('cuestionario')!.value)
        .subscribe((data) => {
          this.lstPreguntas = data;
          this.lstPreguntas.forEach((e, i) => {
            if (i == 0) {
              auxOpciones = '[' + e.codigo + ']';
              this.lstPreguntasOpciones = auxOpciones;
            } else {
              auxOpciones = auxOpciones + ',' + '[' + e.codigo + ']';
              this.lstPreguntasOpciones = auxOpciones;
            }
          });
          this.lstPreguntas.forEach((e, i) => {
            this.lstPreguntasOpcionesDescripcion.push(e.descripcion);
          });
          this.generarReporteAgrupadoOpciones();
        });
    }
  }

  generarReporteAgrupadoTexto() {
    this.respuestaService
      .generarReporteAgrupadoTexto(
        this.form.get('cuestionario')!.value,
        this.lstPreguntasTexto
      )
      .subscribe((data) => {
        this.lstReporteAgrupado = data;
        //this.dataSource = new MatTableDataSource<ReporteAgrupado>(data);

        //this.paginator.firstPage();
        //this.dataSource.paginator = this.paginator;
        this.loadingUsco(this.lstReporteAgrupado);
        this.vistaPreviaResultados = false;
      });
  }

  generarReporteAgrupadoOpciones() {
    this.respuestaService
      .generarReporteAgrupadoOpciones(
        this.form.get('cuestionario')!.value,
        this.lstPreguntasOpciones
      )
      .subscribe((data) => {
        this.lstReporteAgrupado = data;
        //this.dataSource = new MatTableDataSource<ReporteAgrupado>(data);

        //this.paginator.firstPage();
        //this.dataSource.paginator = this.paginator;
        this.loadingUsco(this.lstReporteAgrupado);
        this.vistaPreviaResultados = false;
      });
  }

  getColumnas(): string[] {
    const allColumns: string[] = [];
    this.lstReporteAgrupado.forEach((data) => {
      const columns = Object.keys(data.columnas);
      columns.forEach((column) => {
        if (!allColumns.includes(column)) {
          allColumns.push(column);
        }
      });
    });
    allColumns.sort();
    return allColumns;
  }

  exportTableToExcel() {
    // Obtener la referencia de la tabla desde el DOM
    const table = document.getElementById('miTabla');

    // Crear una nueva instancia de Workbook de xlsx
    const workbook = XLSX.utils.table_to_book(table);

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Crear un Blob a partir del buffer de Excel
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Guardar el archivo utilizando FileSaver.js
    saveAs(blob, this.form.get('titulo')!.value + '.xlsx');
  }

  onCancelar() {
    this.form.reset();
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (arr[0] == 'Access token expired') {
      this.auth.logout();
      this.router.navigate(['login']);
    }
  }
}
