import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  faFileCsv,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-instructors',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, FormsModule],
  templateUrl: './instructors.html',
  styleUrl: './instructors.css'
})
export default class Instructors implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faFileCsv = faFileCsv;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private instructorsService = inject(InstructorsService);

  allInstructors: any[] = [];
  instructors: any[] = [];
  searchInstructor: string = '';
  startDate: string = '';
  endDate: string = '';


  userRole: string = '';
  selectedInstructors: any = null;

  isLoading = false;
  mostrarModal = false;
  mostrarEditModal = false;

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

  updateInstructor() {
    if (this.form.invalid || !this.selectedInstructors) return;

    const { nombres, cedula, telefono, correo, especialidad } = this.form.getRawValue();
    const id_instructor = this.selectedInstructors.id_instructor;

    this.isLoading = true;

    this.instructorsService.updateInstructor(nombres, cedula, telefono, correo, especialidad, id_instructor).subscribe({
      next: (res) => {
        console.log(res);
        this.notification.showSuccess('Instructor actualizado correctamente');
        this.form.reset();
        this.loadInstructors();
        this.cerrarEditModal();
      }, error: (error) => {
        this.notification.showError('Error al actualizar instructor');
        console.error('Error al actualizar instructor:', error);
        this.isLoading = false;
      }
    });
  }

  deleteInstructor(id_instructor: number) {
    if (!confirm('⚠️¿Estás seguro de eliminar este instructor?⚠️')) return;
    this.isLoading = true;
    this.instructorsService.deleteInstructor(id_instructor).subscribe({
      next: (response) => {
        this.notification.showSuccess('Instructor eliminado correctamente');
        this.loadInstructors();
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al eliminar este instructor:', error);
        this.notification.showError('Error al eliminar este instructor');
        this.isLoading = false;
      }
    })
  }

  searchInstructors() {
    const cedula = this.searchInstructor?.trim() || '';
    const start = this.startDate || '';
    const end = this.endDate || '';

    this.instructorsService.getInstructorsByParams(cedula, start, end).subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.notification.showError('No se encontraron instructores con esos criterios.');
        } else {
          this.instructors = response;
        }
      },
      error: () => {
        this.notification.showError('Error al buscar instructores.');
      }
    });
  }

  clearSearch() {
    this.searchInstructor = '';
    this.startDate = '';
    this.endDate = '';
    this.instructors = this.allInstructors;
  }

  generarReporteExcel() {
    const data = this.instructors.map(i => ({
      'N°': i.id_instructor,
      'Instructor': i.nombres,
      'Cédula': i.cedula,
      'Télefono': i.telefono,
      'Correo': i.correo,
      'Especialidad': i.especialidad,
      'Activo': i.activo,
      'Fecha contrato': new Date(i.fecha_contratacion).toLocaleDateString(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    //Definir ancho para cada columna (en caracteres)
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 35 },
      { wch: 15 },
      { wch: 25 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Instructores': worksheet },
      SheetNames: ['Instructores']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Reporte_Instructores.xlsx');
  }


  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  abrirEditModal(inst: any) {
    this.selectedInstructors = inst;
    this.form.patchValue({
      nombres: inst.nombres,
      cedula: inst.cedula,
      telefono: inst.telefono,
      correo: inst.correo,
      especialidad: inst.especialidad,
    });
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.selectedInstructors = null;
    this.mostrarEditModal = false;
  }
}
