export class ReporteAgrupado {
  fecha!: string;
  estamento!: string;
  columnas!: {
    [key: string]: string | null;
  };
}
