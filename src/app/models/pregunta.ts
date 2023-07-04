import { Cuestionario } from './cuestionario';
import { GrupoEscala } from './grupo-escala';
import { TipoRespuesta } from './tipo-respuesta';

export class Pregunta {
  codigo!: number;
  descripcion!: string;
  estado!: number;
  textoAdicional!: string;
  tipo!: number;
  tipoRespuesta!: TipoRespuesta;
  cuestionario!: Cuestionario;
  obligatorio!: number;
  depende!: number;
  gre!: GrupoEscala;
  identificador!: string;
}
