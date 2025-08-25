import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-technical-support',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './technical-support.html',
  styleUrl: './technical-support.css'
})
export default class TechnicalSupport {
  private _formBuilder = inject(FormBuilder);
  private userService = inject(UsersService);
  private notification = inject(NotificationService);

  supportForm: FormGroup;
  isSending = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor() {
    this.supportForm = this._formBuilder.group({
      nombre_usuario: ['', Validators.required],
      gmail: ['', Validators.required, Validators.email],
      mensaje: ['', Validators.required],
    });
  }

  enviarMensaje() {
    if (this.supportForm.invalid) return;

    this.successMessage = null;
    this.errorMessage = null;
    this.isSending = true;

    const { nombre_usuario, gmail, mensaje } = this.supportForm.value;

    this.userService.getUserName(nombre_usuario).subscribe({
      next: (users) => {
        if (!users || users.length === 0) {
          this.notification.showError('El usuario no existe');
          this.isSending = false;
          return;
        }

        const templateParams = { nombre_usuario, gmail, mensaje};
        // Reemplaza estos con tus claves reales de EmailJS
        const SERVICE_ID = 'service_qgppk0n';
        const TEMPLATE_ID = 'template_fqj4qob';
        const PUBLIC_KEY = 'K0HyvRa0psziM1SZd';

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
          .then((response: EmailJSResponseStatus) => {
            this.notification.showSuccess('Mensaje enviado correctamente');
            this.supportForm.reset();
            this.isSending = false;
          }, (error) => {
            console.error('Error al enviar mensaje:', error);
            this.notification.showError('Error al enviar el mensaje');
            this.isSending = false;
          });
      },
      error: (err) => {
        console.error('Error al validar usuario:', err);
        this.errorMessage = 'Error al validar el usuario.';
        this.isSending = false;
      },
    });
  }

}
