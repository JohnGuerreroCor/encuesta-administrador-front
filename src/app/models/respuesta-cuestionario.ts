import { Cuestionario } from './cuestionario';
import { Persona } from './persona';

export class RespuestaCuestionario {
  codigo!: number;
  cuestionario!: Cuestionario;
  persona!: Persona;
  estado!: number;
  fecha!: Date;
  vinculacion!: string;
  estamento!: number;
  calendatio!: number;
}
