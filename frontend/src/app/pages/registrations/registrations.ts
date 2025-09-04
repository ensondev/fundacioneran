import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faIdCard,
  faFileCsv,
} from '@fortawesome/free-solid-svg-icons';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { RegistrationsService } from '../../services/registration.service';
import { ParticipantsService } from '../../services/participants.service';
import { CoursesService } from '../../services/courses.service';
import { SubjectService } from '../../services/subject.service';
@Component({
  selector: 'app-registrations',
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, FormsModule],
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
  faFileCsv = faFileCsv;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private registrationsService = inject(RegistrationsService);
  private participantsService = inject(ParticipantsService);
  private coursesService = inject(CoursesService);
  private subjectService = inject(SubjectService);

  allRegistrations: any[] = [];
  registrations: any[] = [];
  allParticipants: any[] = [];
  participants: any[] = [];
  allCourses: any[] = [];
  courses: any[] = [];
  subjects: any[] = [];
  allSubjects: any[] = [];

  searchRegistration: string = '';
  searchStatus: string = '';
  searchCourses: number = 0;
  startDate: string = '';
  endDate: string = '';


  userRole: string = '';
  selectedRegistrations: any = null;

  isLoading = false;
  mostrarModal = false;
  mostrarEditModal = false

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

  loadSubject() {
    this.isLoading = true;

    this.subjectService.getSubject().subscribe({
      next: (response) => {
        this.allSubjects = response;
        this.subjects = response;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar las materias:', error);
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

  updateRegistration() {
    if (this.form.invalid || !this.selectedRegistrations) return;

    const { participante_id, curso_id } = this.form.getRawValue();
    const id_inscripcion = this.selectedRegistrations.id_inscripcion;

    this.isLoading = true;

    this.registrationsService.updateRegistration(participante_id, curso_id, id_inscripcion).subscribe({
      next: (res) => {
        this.notification.showSuccess('Inscripción actualizada correctamente');
        this.loadRegistrations();
        this.cerrarEditModal();
        this.form.reset();
        this.isLoading = false;
      }, error: (error) => {
        this.notification.showError('Error al actualizar la inscripción');
        console.error('Error al actualizar la inscripción:', error);
        this.isLoading = false;
      }
    });
  }

  deleteRegistration(id_inscripcion: number) {
    if (!confirm('⚠️¿Estás seguro de eliminar esta suscripción?⚠️')) return;

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

  searchRegistrations() {
    const cedula = this.searchRegistration;
    const estado = this.searchStatus;
    const id_materia = this.searchCourses;
    const fecha_inicio = this.startDate;
    const fecha_fin = this.endDate;

    this.registrationsService.getRegistrationsByParams(cedula, estado, id_materia, fecha_inicio, fecha_fin).subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.notification.showError('No se encontraron resultados con esos filtros.');
        }
        this.registrations = response;
      },
      error: (error) => {
        console.error('Error al buscar inscripciones', error);
        this.notification.showError('Ocurrió un error al buscar las inscripciones.');
      }
    });
  }

  clearSearch() {
    this.searchRegistration = '';
    this.searchStatus = '';
    this.searchCourses = 0;
    this.startDate = '';
    this.endDate = '';

    this.registrations = this.allRegistrations;
  }


  generarReporteExcel() {
    const data = this.registrations.map(r => ({
      'N°': r.id_inscripcion,
      'Participante': r.nombres,
      'Curso': r.nombre_materia,
      'Inscripción': r.estado_inscripcion,
      'Fecha inscripción': new Date(r.fecha_inscripcion).toLocaleDateString(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    //Definir ancho para cada columna (en caracteres)
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 35 },
      { wch: 35 },
      { wch: 25 },
      { wch: 25 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Inscripciones': worksheet },
      SheetNames: ['Inscripciones']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Reporte_Inscripciones.xlsx');
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  abrirEditModal(regi: any) {
    this.selectedRegistrations = regi;
    this.form.patchValue({
      participante_id: regi.id_participante,
      curso_id: regi.id_curso,
    });
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.selectedRegistrations = null;
    this.mostrarEditModal = false;
  }
}
