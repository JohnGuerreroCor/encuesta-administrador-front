import { Pregunta } from './pregunta';
import { RespuestaOpciones } from './respuesta-opciones';
import { TipoRespuesta } from './tipo-respuesta';

export class PreguntaRespuestas {
  codigo!: number;
  estado!: number;
  descripcionAdicional!: string;
  pregunta!: Pregunta;
  tipoRespuestas!: TipoRespuesta;
  respuestaOpciones!: RespuestaOpciones;
  depende!: number;
}
