import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './log-in.html',
  styles: ``,
  styleUrl: './log-in.css'
})
export default class LogIn {
  private _authService = inject(AuthService);
  private _authState = inject(AuthStateService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  private _subscription: Subscription | null = null;
  errorMessage: string | null = null;


  loginForm!: FormGroup;

  form = this._formBuilder.group({
    username: this._formBuilder.nonNullable.control('', Validators.required),
    password: this._formBuilder.nonNullable.control('', Validators.required)
  })


  submit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.getRawValue();

    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = this._authService.logIn(username, password).subscribe({
      next: (response: any) => {
        if (response.p_status && response.p_data?.token) {
          const session = {
            usuario: response.p_data.usuario,
            rol: response.p_data.rol,
            token: response.p_data.token
          };
          this._authState.setSession(session);
          this._router.navigate(['/home']); // Usa navigate en lugar de navigateByUrl
        } else {
          console.error('Token no recibido en la respuesta', response);
          this.errorMessage = response.p_message || 'Usuario o contraseña incorrecta';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }
}
