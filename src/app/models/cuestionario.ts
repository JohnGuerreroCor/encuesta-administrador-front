import { Uaa } from './uaa';

export class Cuestionario {
  codigo!: number;
  nombre!: string;
  instrucciones!: string;
  estado!: number;
  uaa!: Uaa;
  inicio!: Date;
  fin!: Date;
}
