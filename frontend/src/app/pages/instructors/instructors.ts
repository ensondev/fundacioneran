import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { InstructorsService } from '../../services/instructors.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faL
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-instructors',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './instructors.html',
  styleUrl: './instructors.css'
})
export default class Instructors implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private instructorsService = inject(InstructorsService);

  allInstructors: any[] = [];
  instructors: any[] = [];

  userRole: string = '';

  isLoading = false;
  mostrarModal = false;

  InstructorsForm!: FormGroup;

  form = this._formBuilder.group({
    nombres: this._formBuilder.nonNullable.control('', Validators.required),
    cedula: this._formBuilder.nonNullable.control('', Validators.required),
    telefono: this._formBuilder.nonNullable.control('', Validators.required),
    correo: this._formBuilder.nonNullable.control('', Validators.required),
    especialidad: this._formBuilder.nonNullable.control('', Validators.required),
  });

  ngOnInit() {
    this.loadInstructors();

    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadInstructors() {
    this.isLoading = true;

    this.instructorsService.getInstructors().subscribe({
      next: (response) => {
        this.allInstructors = response;
        this.instructors = response;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar los instructores:', error);
        this.isLoading = false;
      }
    })
  }

  insertInstructor() {
    if (this.form.invalid) return;

    const { nombres, cedula, telefono, correo, especialidad } = this.form.getRawValue();

    this.isLoading = true;

    this.instructorsService.insertInstructor(nombres, cedula, telefono, correo, especialidad).subscribe({
      next: (response) => {
        this.notification.showSuccess('Instructor registrado correctamente');
        this.loadInstructors();
        this.cerrarModal();
        this.form.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al registrar instructor');
        this.form.reset();
        this.isLoading = false;
      }
    })
  }

  deleteInstructor(id_instructor: number){
    if(!confirm('⚠️¿Estás seguro de eliminar este instructor?⚠️')) return ;
    this.isLoading = true;
    this.instructorsService.deleteInstructor(id_instructor).subscribe({
      next:(response) => {
        this.notification.showSuccess('Instructor eliminado correctamente');
        this.loadInstructors();
        this.isLoading = false;
      },error:(error) => {
        console.error('Error al eliminar este instructor:', error);
        this.notification.showError('Error al eliminar este instructor');
        this.isLoading = false;
      }
    })
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
