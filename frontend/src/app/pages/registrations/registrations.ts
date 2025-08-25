import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faIdCard,
  faL,
} from '@fortawesome/free-solid-svg-icons';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { RegistrationsService } from '../../services/registration.service';
import { ParticipantsService } from '../../services/participants.service';
import { CoursesService } from '../../services/courses.service';
@Component({
  selector: 'app-registrations',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './registrations.html',
  styleUrl: './registrations.css'
})
export default class Registrations implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faIdCard = faIdCard;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private registrationsService = inject(RegistrationsService);
  private participantsService = inject(ParticipantsService);
  private coursesService = inject(CoursesService);

  allRegistrations: any[] = [];
  registrations: any[] = [];
  allParticipants: any[] = [];
  participants: any[] = [];
  allCourses: any[] = [];
  courses: any[] = [];

  userRole: string = '';

  isLoading = false;
  mostrarModal = false;

  RegistrationsForm!: FormGroup;

  form = this._formBuilder.group({
    participante_id: this._formBuilder.control<number | null>(null, Validators.required),
    curso_id: this._formBuilder.control<number | null>(null, Validators.required)
  });

  ngOnInit() {
    this.loadRegistrations();
    this.loadParticipants();
    this.loadCourses();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadRegistrations() {
    this.isLoading = true;

    this.registrationsService.getRegistrations().subscribe({
      next: (response) => {
        this.allRegistrations = response;
        this.registrations = response;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar las inscripciones:', error);
        this.isLoading = false;
      }
    });
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
    });
  }

  loadCourses() {
    this.isLoading = true;

    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.allCourses = response;
        this.courses = response;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar los cursos:', error);
        this.isLoading = false;
      }
    });
  }

  insertRegistrations() {
    if (this.form.invalid) return;

    const { participante_id, curso_id } = this.form.getRawValue();

    const cursoSeleccionado = this.courses.find(c => c.id_curso === Number(curso_id));
    const inscripciones = Number(cursoSeleccionado.inscripciones_actuales);
    const cupo = Number(cursoSeleccionado.cupo_maximo);

    if (isNaN(inscripciones) || isNaN(cupo)) {
      console.warn('Datos de curso inválidos:', cursoSeleccionado);
      this.notification.showError('Error al verificar cupo del curso.');
      return;
    }

    if (inscripciones >= cupo) {
      this.notification.showError('Cupo completo. No se pueden realizar más inscripciones.');
      return;
    }

    this.isLoading = true;

    this.registrationsService.insertRegistration(participante_id, curso_id).subscribe({
      next: (response) => {
        this.notification.showSuccess('Suscripción registrada correctamente');
        this.loadRegistrations();
        this.form.reset();
        this.cerrarModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al registrar suscripción:', error);
        this.notification.showError('Error al registrar suscripción');
        this.isLoading = false;
      }
    });
  }

  deleteRegistration(id_inscripcion: number) {
    const confirmDelete = confirm('⚠️¿Estás seguro de que deseas eliminar esta suscripción?⚠️');

    this.isLoading = true;

    this.registrationsService.deleteRegistration(id_inscripcion).subscribe({
      next: (response) => {
        this.notification.showSuccess('Inscripción eliminada correctamente');
        this.loadRegistrations();
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al eliminar inscripción:', error);
        this.notification.showError('Error al eliminar inscripción');
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
