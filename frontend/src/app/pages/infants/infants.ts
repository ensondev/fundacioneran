import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faBell,
  faCircleExclamation,
  faFileCsv,
  faSleigh
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { InfantsService } from '../../services/infants.service';
@Component({
  selector: 'app-infants',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, FormsModule],
  templateUrl: './infants.html',
  styleUrl: './infants.css'
})
export default class Infants implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faBell = faBell;
  faCircleExclamation = faCircleExclamation;
  faFileCsv = faFileCsv;

  private _formBuilder = inject(FormBuilder);
  private infantsService = inject(InfantsService);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);

  allInfants: any[] = [];
  infants: any[] = [];
  userRole: string = '';
  isLoading = false;
  selectedInfants: any = null;
  mostrarModal = false;
  mostrarEditModal = false;

  InfantsForm!: FormGroup;

  form = this._formBuilder.group({
    nombres: this._formBuilder.nonNullable.control('', Validators.required),
    cedula: this._formBuilder.nonNullable.control('', Validators.required),
    genero: this._formBuilder.nonNullable.control('', Validators.required),
    fecha_nacimiento: this._formBuilder.nonNullable.control('', Validators.required),
    nombre_acudiente: this._formBuilder.nonNullable.control('', Validators.required),
    cedula_acudiente: this._formBuilder.nonNullable.control('', Validators.required),
    telefono_acudiente: this._formBuilder.nonNullable.control('', Validators.required),
    direccion: this._formBuilder.nonNullable.control('', Validators.required),
  });

  ngOnInit() {
    this.loadInfants();

    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadInfants() {
    this.isLoading = true;

    this.infantsService.getInfants().subscribe({
      next: (res) => {
        this.allInfants = res;
        this.infants = res;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar infantes:', error);
        this.isLoading = false;
      }
    })
  }

  insertInfant() {
    if (this.form.invalid) return;

    const { nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion } = this.form.getRawValue();

    this.isLoading = true;

    this.infantsService.InsertInfant(nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion).subscribe({
      next: (response) => {
        console.log(response)
        this.notification.showSuccess('Infante registrado correctamente');
        this.loadInfants();
        this.cerrarModal();
        this.form.reset();
        this.isLoading = false;
      }, error: (error) => {
        this.notification.showError('Error al registrar el infante');
        console.error('Error al registrar el infante:', error);
        this.isLoading = false;
      }
    });
  }

  updateInfant() {
    if (this.form.invalid || !this.selectedInfants) return;

    const { nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion } = this.form.getRawValue();
    const id_infante = this.selectedInfants.id_infante;

    this.isLoading = true;

    this.infantsService.updateInfant(nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, id_infante).subscribe({
      next: (res) => {
        this.notification.showSuccess('Infante actualizado correctamente');
        this.loadInfants();
        this.cerrarEditModal();
        this.form.reset();
        this.isLoading = false;
      }, error: (error) => {
        this.notification.showError('Error al actualizar infante');
        console.error('Error al actualizar infante:', error);
        this.isLoading = false;
      }
    })
  }

  deleteInfant(id_infante: number) {
    if (!confirm('⚠️¿Estás seguro de eliminar este infante?⚠️')) return;
    this.isLoading = true;

    this.infantsService.deleteInfant(id_infante).subscribe({
      next: (response) => {
        this.notification.showSuccess('Infante eliminado correctamente');
        this.loadInfants();
        this.isLoading = false;
      }, error: (error) => {
        this.notification.showError('Error al eliminar infante');
        console.error('Error al eliminar infante:', error);
        this.isLoading = false;
      }
    })
  }

  generarReporteExcel() {
    const data = this.infants.map(i => ({
      'N°': i.id_infante,
      'Infante': i.nombres,
      'Cédula': i.cedula,
      'Fecha nacimiento': new Date(i.fecha_nacimiento).toLocaleDateString(),
      'Acudiente': i.nombre_acudiente,
      'Cédula acudiente': i.cedula_acudiente,
      'Télefono': i.telefono_acudiente,
      'Fecha registro': new Date(i.fecha_registro).toLocaleDateString(),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    //Definir ancho para cada columna (en caracteres)
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Infantes': worksheet },
      SheetNames: ['Infantes']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Reporte_Infantes.xlsx');
  }

  abrirEditModal(infant: any) {
    this.selectedInfants = infant;
    this.form.patchValue({
      nombres: infant.nombres,
      cedula: infant.cedula,
      genero: infant.genero,
      fecha_nacimiento: infant.fecha_nacimiento,
      nombre_acudiente: infant.nombre_acudiente,
      cedula_acudiente: infant.cedula_acudiente,
      telefono_acudiente: infant.telefono_acudiente,
      direccion: infant.direccion
    })
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.selectedInfants = null;
    this.mostrarEditModal = false;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.form.reset();
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
