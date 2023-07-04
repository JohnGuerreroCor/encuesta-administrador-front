import { Sede } from './sede';
import { UaaTipo } from './uaa-tipo';
import { Municipio } from './municipio';
import { Estado } from './estado';

export class Uaa {
  codigo!: number;
  nombre!: string;
  nombreCorto!: string;
  nombreImpresion!: string;
  estado!: Estado;
  ESTADO!: number;
  sede!: Sede;
  uaaTipo!: UaaTipo;
  municipio!: Municipio;
  uaa_dependencia!: number;
  jefe!: string;
  email!: string;
  telefono!: string;
  pagina!: string;
  direccion!: string;
  acronimo!: string;
  centro_costos!: string;
}
