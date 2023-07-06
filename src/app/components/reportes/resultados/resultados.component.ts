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

interface OpcionEncuesta {
  label: any;
  value: any;
}

/* const data = {
  chart: {
    caption: 'Countries with Highest Deforestation Rate',
    subcaption: 'For the year 2017',
    yaxisname: 'Deforested Area{br}(in Hectares)',
    decimals: '1',
    theme: 'fusion',
  },
  data: [
    {
      label: 'Brazil',
      value: '1466000',
    },
    {
      label: 'Indonesia',
      value: '1147800',
    },
    {
      label: 'Russian Federation',
      value: '532200',
    },
    {
      label: 'Mexico',
      value: '395000',
    },
    {
      label: 'Papua New Guinea',
      value: '250200',
    },
    {
      label: 'Peru',
      value: '224600',
    },
    {
      label: 'U.S.A',
      value: '215200',
    },
    {
      label: 'Bolivia',
      value: '135200',
    },
    {
      label: 'Sudan',
      value: '117807',
    },
    {
      label: 'Nigeria',
      value: '82000',
    },
  ],
}; */

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
  providers: [DatePipe],
})
export class ResultadosComponent implements OnInit {
  width = '600';
  height = '400';
  type = 'column3d';
  dataFormat = 'json';
  dataSource: any;

  gifUrlLoad =
    'https://www.usco.edu.co/imagen-institucional/logo/precarga-usco.gif';
  gifActivate = false;

  /* public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  }; */

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
    this.type = this.form.get('grafico')!.value;
    this.vistaPreviaResultados = true;
    this.loadingUsco(null);
    this.validador = true;
    this.vistaResultados = false;
    this.respuestaService
      .generarDatosGrafica(this.form.get('codigo')!.value)
      .subscribe((datos) => {
        this.validador = true;
        this.vistaResultados = true;
        this.lstDatosGrafica = datos;
        //console.log(datos);
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
              decimals: '1',
              theme: 'fusion',
              exportEnabled: '1',
              exportFormats:
                'PNG=Descargar Imágen|PDF=Imprimir Gráfica|XLSX=Export Chart Data',
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

    console.log(typeof pieChartColor);

    return pieChartColor;
  }

  // ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40]},
  // ];
  form!: FormGroup;

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
  }): void {
    console.log(event, active);
  }

  pieChartColors: Array<{}> = new Array();

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
