import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthStateService } from '../../shared/service/auth-state.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export default class Profile implements OnInit {
  private authStateService = inject(AuthStateService);
  private usersService = inject(UsersService);

  usuario: string = '';
  rol: string = '';
  iniciales: string = '';

  ngOnInit() {
    const session = this.authStateService.getSession();
    if (session) {
      this.usuario = session ? session.usuario : '';
      this.rol = session ? session.rol : '';
      this.iniciales = this.obtenerIniciales(session.usuario);
    }
  }

  obtenerIniciales(nombre: string): string {
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
    return (palabras[0][0] + palabras[1][0]).toUpperCase();
  }
}
