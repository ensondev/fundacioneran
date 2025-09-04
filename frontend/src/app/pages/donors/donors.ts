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
  faBell,
  faCircleExclamation,
  faFileCsv
} from '@fortawesome/free-solid-svg-icons';
import { DonorsService } from '../../services/donors.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-donors',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, FormsModule],
  templateUrl: './donors.html',
  styleUrl: './donors.css'
})
export default class Donors implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faBell = faBell;
  faCircleExclamation = faCircleExclamation;
  faFileCsv = faFileCsv;

  private _formBuilder = inject(FormBuilder);
  private donorService = inject(DonorsService);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);

  donors: any[] = [];
  userRole: string = '';
  searchCedula: string = '';
  isLoading = false;
  selectedDonor: any = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  mostrarModal = false;
  mostrarEditModal = false;

  DonorsForm!: FormGroup;

  editForm = this._formBuilder.group({
    telefono: this._formBuilder.nonNullable.control('', Validators.required)
  });

  ngOnInit(): void {
    this.loadDonors();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadDonors() {
    this.isLoading = true;
    this.errorMessage = null;

    this.donorService.getDonors().subscribe({
      next: (data) => {
        this.donors = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los donadores. Intente nuevamente.';
        console.error('Error al cargar donadores:', error);
        this.isLoading = false;
      }
    });
  }

  updateDonor() {
    if (this.editForm.invalid || !this.selectedDonor) return;

    const { telefono } = this.editForm.getRawValue();

    const updatedDonor = {
      id_donante: this.selectedDonor.id_donante,
      nombres: this.selectedDonor.nombres,
      numero_identificacion: this.selectedDonor.numero_identificacion,
      telefono: telefono
    };

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.donorService.updateDonor(updatedDonor).subscribe({
      next: (response) => {
        this.notification.showSuccess('Donador actualizado correctamente');
        this.loadDonors();
        this.cerrarEditModal();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al actualizar el donador');
        console.error('Error al actualizar donador:', error);
        this.isLoading = false;
      }
    });
  }

  eliminarDonor(id_donante: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar este donador?⚠️')) return;

    this.isLoading = true;

    this.donorService.deleteDonor(id_donante).subscribe({
      next: () => {
        this.notification.showSuccess('Donador eliminado correctamente')
        this.loadDonors();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al eliminar donador');
        console.error('Error al eliminar donador:', error);
        this.isLoading = false;
      }
    });
  }

  searchByCedula() {
    if (!this.searchCedula.trim()) {
      this.loadDonors();
      return;
    }

    this.isLoading = true;

    this.donorService.getDonorByCedula(this.searchCedula).subscribe({
      next: (donor) => {
        if (donor) {
          this.donors = [donor];
        } else {
          /* this.donors = [this.loadDonors()]; */
          this.notification.showError('Donador no registrado');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al buscar donante:', error);
        this.isLoading = false;
      }
    });
  }

  generarReporteExcel() {
    const data = this.donors.map(d => ({
      'ID': d.id_donante,
      'Nombre': d.nombres,
      'Cédula': d.numero_identificacion,
      'Teléfono': d.telefono,
      'Fecha de Registro': new Date(d.fecha_registro).toLocaleDateString()
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // 👇 Definir ancho para cada columna (en caracteres)
    worksheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 35 },  // Nombre
      { wch: 15 },  // Cédula
      { wch: 15 },  // Teléfono
      { wch: 20 }   // Fecha de Registro
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Donadores': worksheet },
      SheetNames: ['Donadores']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Reporte_Donadores.xlsx');
  }

  abrirEditModal(donor: any) {
    this.selectedDonor = donor;
    this.editForm.patchValue({
      telefono: donor.telefono
    });
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.mostrarEditModal = false;
    this.selectedDonor = null;
  }

  clearSearch() {
    this.searchCedula = '';
    this.loadDonors();
    this.errorMessage = null;
  }

}
