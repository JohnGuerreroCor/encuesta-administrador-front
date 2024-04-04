import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Cuestionario } from 'src/app/models/cuestionario';
import { DatosGraficaPreguntaPrincipal } from 'src/app/models/datos-grafica-pregunta-principal';
import { CuestionarioService } from 'src/app/services/cuestionario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { DatePipe } from '@angular/common';
import { Resultados } from 'src/app/models/resultados';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface OpcionEncuesta {
  label: any;
  value: any;
}

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
  providers: [DatePipe],
})
export class ResultadosComponent implements OnInit {
  titulo = '';
  width = '600';
  height = '400';
  type = 'column3d';
  dataFormat = 'json';
  dataSource: any;
  total: number = 0;

  gifUrlLoad =
    'https://www.usco.edu.co/imagen-institucional/logo/precarga-usco.gif';
  gifActivate = false;

  lstResultados!: Resultados[];
  lstCuestionarios!: Cuestionario[];
  //public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  //public barChartPlugins = [pluginDataLabels];
  barChartLabels: Array<any> = new Array();
  lstDatosGrafica!: DatosGraficaPreguntaPrincipal[];
  barChartData: any[] = [];
  validador: boolean = false;
  vistaPreviaResultados: boolean = true;
  vistaResultados: boolean = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cuestionarioService: CuestionarioService,
    private respuestaService: RespuestasService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.initForm();
    this.find();
  }

  loadingUsco(url: any) {
    this.gifActivate = true;
    if (url != null) {
      this.gifActivate = false;
    }
  }

  onGenerarDatos() {
    this.barChartData = [];
    this.total = 0;
    this.lstResultados = [];
    this.type = this.form.get('grafico')!.value;
    this.vistaPreviaResultados = true;
    this.loadingUsco(null);
    this.validador = true;
    this.vistaResultados = false;
    this.respuestaService
      .obtenerResultados(this.form.get('codigo')!.value)
      .subscribe((data) => {
        this.lstResultados = data;
        this.lstResultados.forEach((resultado) => {
          this.total = this.total + resultado.resultados;
        });
      });
    this.respuestaService
      .generarDatosGrafica(this.form.get('codigo')!.value)
      .subscribe((datos) => {
        this.validador = true;
        this.vistaResultados = true;
        this.lstDatosGrafica = datos;
        datos.forEach((e, i) => {
          let op: Array<OpcionEncuesta> = [];
          datos[i].opciones.forEach((a, x) => {
            op[x] = {
              label: a,
              value: datos[i].valores[x],
            };
          });
          let data = {
            chart: {
              caption: datos[i].pregunta.descripcion,
              subcaption:
                'Datos haste el ' +
                this.datePipe.transform(new Date(), 'dd-MM-yyyy HH:mm:ss'),
              yaxisname: 'Total de respuestas',
              decimals: '0,1',
              theme: 'fusion',
              exportEnabled: '1',
              valuefontcolor: '#000000',
              showvalues: '1',
              exportFormats: 'PNG=Descargar Imágen|PDF=Imprimir Gráfica',
              exportTargetWindow: '_self',
              exportFileName: datos[i].pregunta.descripcion,
            },
            data: op,
          };
          this.barChartData.push(data);
          this.loadingUsco(null);
        });
        this.dataSource = this.barChartData;
        this.vistaPreviaResultados = false;
        this.loadingUsco(datos);
      });
  }

  generarColor() {
    let pieChartColor = [
      {
        backgroundColor: `rgba(${Math.random() * 255}, ${
          Math.random() * 255
        } , ${Math.random() * 255},0.8)`,
      },
      {},
    ];

    return pieChartColor;
  }

  setTituloResultados(nombreCuestionario: string) {
    this.titulo = nombreCuestionario;
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
    saveAs(blob, 'Resultado General' + this.titulo + '.xlsx');
  }

  find() {
    this.cuestionarioService.find().subscribe((data) => {
      this.lstCuestionarios = data;
    });
  }

  initForm() {
    this.form = this.fb.group({
      codigo: new FormControl('', Validators.required),
      grafico: new FormControl('', Validators.required),
    });
  }

  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {}

  pieChartColors: Array<{}> = new Array();

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {}
}
