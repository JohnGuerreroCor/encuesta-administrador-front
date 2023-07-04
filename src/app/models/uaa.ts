import { Sede } from './sede';
import { UaaTipo } from './uaa-tipo';
import { Municipio } from './municipio';
import { Estado } from './estado';

export class Uaa {
  codigo!: number;
  nombre!: String;
  nombreCorto!: String;
  nombreImpresion!: String;
  estado!: Estado;
  ESTADO!: number;
  sede!: Sede;
  uaaTipo!: UaaTipo;
  municipio!: Municipio;
  uaa_dependencia!: number;
  jefe!: String;
  email!: String;
  telefono!: String;
  pagina!: String;
  direccion!: String;
  acronimo!: String;
  centro_costos!: String;
}
