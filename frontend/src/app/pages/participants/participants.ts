import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { ParticipantsService } from '../../services/participants.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-participants',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export default class Participants implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private participantsService = inject(ParticipantsService);

  allParticipants: any[] = [];
  participants: any[] = [];

  userRole: string = '';

  isLoading = false;
  mostrarModal = false;

  ParticipantsForm!: FormGroup;

  form = this._formBuilder.group({
    nombres: this._formBuilder.nonNullable.control('', Validators.required),
    cedula: this._formBuilder.nonNullable.control('', Validators.required),
    telefono: this._formBuilder.nonNullable.control('', Validators.required),
    correo: this._formBuilder.nonNullable.control('', Validators.required),
    direccion: this._formBuilder.nonNullable.control('', Validators.required),
    fecha_nacimiento: this._formBuilder.nonNullable.control('', Validators.required),
  });

  ngOnInit() {
    this.loadParticipants();

    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadParticipants() {
    this.isLoading = true;

    this.participantsService.getParticipants().subscribe({
      next: (response) => {
        this.allParticipants = response;
        this.participants = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los participantes:', error);
        this.isLoading = false;
      }
    })
  }


  insertParticipant() {
    if (this.form.invalid) return;

    this.isLoading = true;

    const { nombres, cedula, telefono, correo, direccion, fecha_nacimiento } = this.form.getRawValue();
    console.log(nombres, cedula, telefono, correo, direccion, fecha_nacimiento)
    this.participantsService.insertParticipant(nombres, cedula, telefono, correo, direccion, fecha_nacimiento).subscribe({
      next: (response) => {
        console.log(response);
        this.notification.showSuccess('Participante registrado correctamente');
        this.loadParticipants();
        this.form.reset();
        this.isLoading = false;
        this.cerrarModal();
      }, error: (error) => {
        console.error('Error al registrar participante:', error);
        this.notification.showError('Error al registrar participante');
        this.form.reset();
        this.isLoading = false;
      }
    });
  }

  deleteParticipant(id_participante: number) {
    if(!confirm('⚠️¿Estás seguro de eliminar este participante?⚠️')) return;

    this.isLoading = true;

    this.participantsService.deleteParticipant(id_participante).subscribe({
      next: (response) => {
        this.notification.showSuccess('Participante eliminado correctamente');
        this.loadParticipants();
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al eliminar participante:', error);
        this.notification.showError('Error al eliminar participante');
        this.isLoading = false;
      }
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
