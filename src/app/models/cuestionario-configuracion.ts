import { Uaa } from "./uaa";
import { Cuestionario } from './cuestionario';
import { UsuarioTipo } from "./usuario-tipo";
import { Vinculo } from "./vinculo";

export class CuestionarioConfiguracion {

    codigo!: number;
    estado!: number;
    fechaRegistro!: Date;
    uaa!: Uaa;
    cuestionario!: Cuestionario;
    usuarioTipo!: UsuarioTipo;
    vinculo!: Vinculo;
}