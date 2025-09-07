import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export default class Profile implements OnInit {
  private authStateService = inject(AuthStateService);
  private usersService = inject(UsersService);
  private _formBuilder = inject(FormBuilder);
  private notification = inject(NotificationService);

  usuario: string = '';
  rol: string = '';
  iniciales: string = '';
  isLoading = false;
  mostrarModal = false;
  nombres: string = '';
  apellidos: string = '';
  fecha_nacimiento: string = '';
  correo: string = '';
  telefono: string = '';

  form = this._formBuilder.group({
    password: this._formBuilder.nonNullable.control('', Validators.required)
  })

  ngOnInit() {
    const session = this.authStateService.getSession();
    if (session) {
      this.usuario = session.usuario;
      this.rol = session ? session.rol : '';
      this.iniciales = this.obtenerIniciales(session.usuario);
      this.loadUserData();
    }
  }

  loadUserData() {
    this.isLoading = true;
    this.usersService.getUserName(this.usuario).subscribe({
      next: (response) => {
        if (response.p_status === true) {
          this.nombres = response.p_data.users[0].nombres_completo;
          this.apellidos = response.p_data.users[0].apellidos_completos;
          this.fecha_nacimiento = response.p_data.users[0].fecha_nacimiento;
          this.correo = response.p_data.users[0].correo;
          this.telefono = response.p_data.users[0].numero_telefono;
        } else {
          console.error('No se encontró el usuario o error en la respuesta');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
        this.isLoading = false;
      }
    });
  }

  updatePassword() {
    if (this.form.invalid) return;

    const { password } = this.form.getRawValue();

    this.isLoading = true;

    this.usersService.updatePassword(password, this.usuario).subscribe({
      next: (response) => {
        console.log(response)
        this.notification.showSuccess('Contraseña actualizada correctamente');
        this.cerrarModal();
        this.loadUserData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al actualizar la contraseña:', err);
        this.notification.showError('Error al actualizar la contraseña');
        this.isLoading = false;
      }
    })
  }


  obtenerIniciales(nombre: string): string {
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
    return (palabras[0][0] + palabras[1][0]).toUpperCase();
  }


  abrirModal() {
    this.form.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.form.reset();
    this.mostrarModal = false;
  }
}
