import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { CoursesService } from '../../services/courses.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { retry } from 'rxjs';
import { SubjectService } from '../../services/subject.service';
import { InstructorsService } from '../../services/instructors.service';
@Component({
  selector: 'app-courses',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export default class Courses implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private coursesService = inject(CoursesService);
  private subjectService = inject(SubjectService);
  private instructorsService = inject(InstructorsService);

  allCourses: any[] = [];
  courses: any[] = [];
  subjects: any[] = [];
  allSubjects: any[] = [];
  allInstructors: any[] = [];
  instructors: any[] = [];

  userRole: string = '';

  isLoading = false;
  mostrarModal = false;
  mostrarModalSubject = false;

  CoursesForm!: FormGroup;

  form = this._formBuilder.group({
    materia_id: this._formBuilder.control<number | null>(null, Validators.required),
    instructor_id: this._formBuilder.control<number | null>(null, Validators.required),
    descripcion: this._formBuilder.nonNullable.control('', Validators.required),
    fecha_inicio: this._formBuilder.nonNullable.control('', Validators.required),
    fecha_fin: this._formBuilder.nonNullable.control('', Validators.required),
    cupo_maximo: this._formBuilder.control<number | null>(null, Validators.required),
  });

  formSubject = this._formBuilder.group({
    nombre_materia: this._formBuilder.nonNullable.control('', Validators.required),
    descripcion: this._formBuilder.nonNullable.control('', Validators.required),
  });

  ngOnInit() {
    this.loadCourses();
    this.loadSubject();
    this.loadInstructors();

    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
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
    });
  }

  insertCourses() {
    if (this.form.invalid) return;

    const { materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo } = this.form.getRawValue();

    this.isLoading = true;

    this.coursesService.insertCourse(materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo).subscribe({
      next: (response) => {
        this.notification.showSuccess('Curso registrado correctamente');
        this.isLoading = false;
        this.loadCourses();
        this.cerrarModal();
        this.form.reset();
      },
      error: (error) => {
        console.error('Error al registrar el curso:', error);
        this.notification.showError('Error al registrar el curso');
        this.form.reset();
        this.isLoading = false;
      }
    })
  }

  insertSubjet() {
    if (this.formSubject.invalid) return;

    const { nombre_materia, descripcion } = this.formSubject.getRawValue();

    this.isLoading = true;

    this.subjectService.insertSubject(nombre_materia, descripcion).subscribe({
      next: (response) => {
        this.notification.showSuccess('Materia registrada correctamente');
        this.isLoading = false;
        this.loadSubject();
        this.cerrarModalSubject();
        this.formSubject.reset();
      }, error: (error) => {
        console.error('Error al registrar materia:', error);
        this.notification.showError('Error al registrar materia');
        this.formSubject.reset();
        this.isLoading = false;
      }
    })
  }

  deleteCourse(id_curso: number) {
    if(!confirm('⚠️¿Estás seguro de eliminar este curso?⚠️')) return ;

    this.isLoading = true;

    this.coursesService.deleteCourse(id_curso).subscribe({
      next: (response) => {
        this.notification.showSuccess('Curso eliminado correctamente');
        this.loadCourses();
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al eliminar curso:', error);
        this.notification.showError('Error al eliminar curso');
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

  abrirModalSubject() {
    this.mostrarModalSubject = true;
  }

  cerrarModalSubject() {
    this.mostrarModalSubject = false;
  }
}
