import { Pregunta } from './pregunta';
import { PreguntaRespuestas } from './pregunta-respuestas';
import { RespuestaCuestionario } from './respuesta-cuestionario';

export class Respuesta {
  codigo!: number;
  adicional!: string;
  estado!: number;
  texto!: string;
  respuestaCuestionario!: RespuestaCuestionario;
  preguntaRespuesta!: PreguntaRespuestas;
  pregunta!: Pregunta;
}
