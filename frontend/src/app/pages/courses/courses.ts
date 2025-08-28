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
  faXmark,
  faRupiahSign
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
  mostrarModalEdit = false;
  mostrarModalSubject = false;
  selectedCourses: any = null;

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

    // Verificar cada 10 segundos si algún curso ya debe finalizar
    setInterval(() => {
      this.verificarCursosEnTiempoReal();
    }, 10000); // 10,000 ms = 10 segundos
  }

  loadCourses() {
    this.isLoading = true;

    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.allCourses = response;
        this.courses = response;

        const today = new Date();
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        this.courses.forEach((course) => {
          const fechaFin = new Date(course.fecha_fin);
          const fechaFinDateOnly = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());

          // CASO 2: Si aún no ha terminado y está inactivo → actualizar a activo
          if (fechaFinDateOnly > todayDateOnly && course.activo === false) {
            this.coursesService.updateAvailabilityCourse(true, course.id_curso).subscribe({
              next: () => {
                this.loadCourses();
                course.activo = true;
                console.log(`Curso ${course.id_curso} marcado como activo`);
              },
              error: (error) => {
                console.error(`Error al actualizar curso ${course.id_curso}:`, error);
                this.notification.showError(`No se pudo actualizar el estado del curso ${course.id_curso}`);
              }
            });
          }
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
        this.notification.showError('Error al cargar los cursos');
        this.isLoading = false;
      }
    });
  }

  verificarCursosEnTiempoReal() {
    const now = new Date();

    this.courses.forEach((course) => {
      const fechaFin = new Date(course.fecha_fin);

      if (fechaFin <= now && course.activo === true) {
        this.coursesService.updateAvailabilityCourse(false, course.id_curso).subscribe({
          next: () => {
            course.activo = false;
            this.notification.showError(`Curso "${course.nombre_materia}" ha finalizado`);
            console.log(`Curso ${course.id_curso} marcado como inactivo`);
          },
          error: (err) => {
            console.error(`Error al actualizar curso ${course.id_curso}:`, err);
          }
        });
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

  updateCourse() {
    if (this.form.invalid || !this.selectedCourses) return;

    const { materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo } = this.form.getRawValue();
    const curso_id = this.selectedCourses.id_curso;

    this.isLoading = true;

    this.coursesService.updateCourse(materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo, curso_id).subscribe({
      next: (res) => {
        console.log(res);
        this.notification.showSuccess('Curso actualizado correctamente');
        this.loadCourses();
        this.cerrarEditModal();
        this.isLoading = false;
      }, error: (error) => {
        this.notification.showError('Error al actualizar el curso');
        console.log('Error al actualizar el curso:', error);
        this.isLoading = false;
      }
    })
  }

  deleteCourse(id_curso: number) {
    if (!confirm('⚠️¿Estás seguro de eliminar este curso?⚠️')) return;

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

  abrirEditModal(cour: any) {
    this.selectedCourses = cour;
    this.form.patchValue({
      materia_id: cour.materia_id,
      instructor_id: cour.instructor_id,
      descripcion: cour.descripcion,
      fecha_inicio: cour.fecha_inicio,
      fecha_fin: cour.fecha_fin,
      cupo_maximo: cour.cupo_maximo
    });
    this.mostrarModalEdit = true;
  }

  cerrarEditModal() {
    this.selectedCourses = null;
    this.mostrarModalEdit = false;
  }
}
