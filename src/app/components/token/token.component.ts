import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import swal from 'sweetalert2';
import { Correo } from 'src/app/models/correo';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  correo!: Correo;
  codigo!: String;
  codioCorrecto!: String;
  today = new Date();
  cargando: boolean = false;
  public roles: String[] = this.auth.user.roles;
  public rol: String = this.roles.toString();
  @Output() rolEvent = new EventEmitter<any>();

  constructor(
    public auth: AuthService,
    private router: Router,
    public tokenService: TokenService
  ) {}

  ngOnInit() {
    this.tokenService
      .gettokenUsco()
      .subscribe((correo) => (this.correo = correo));
  }

  validarToken() {
    this.cargando = true;
    this.rolEvent.emit(this.rol);
    if (this.codigo) {
      this.tokenService.validartokenUsco(this.codigo).subscribe(
        (response) => {
          this.auth.guardarCodigoverificacion('true');
          swal.fire({
            icon: 'success',
            title: 'Inicio de sesión ',
            text: 'Codigo de verificación correcto.',
            confirmButtonText: 'Listo',
            confirmButtonColor: '#8f141b',
          });
          this.router.navigate(['/inicio']);
        },
        (err) => this.fError(err)
      );
    }
  }

  fError(er: any): void {
    this.cargando = false;
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }
  }
}
