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
  faFileCsv
} from '@fortawesome/free-solid-svg-icons';
import { BeneficiariesService } from '../../services/beneficiaries.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-beneficiaries',
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './beneficiaries.html',
  styleUrl: './beneficiaries.css'
})
export default class Beneficiaries implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faFileCsv = faFileCsv;

  private _formBuilder = inject(FormBuilder);
  private beneficiarieService = inject(BeneficiariesService);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);

  beneficiaries: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedBeneficiarie: any = null;
  mostrarEditModal = false;
  userRole: string = '';
  searchCedula: string = '';

  BeneficiariesForm!: FormGroup;

  editForm = this._formBuilder.group({
    direccion_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    telefono_beneficiario: this._formBuilder.nonNullable.control('', Validators.required)
  });

  ngOnInit(): void {
    this.loadsBeneficiares();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadsBeneficiares() {
    this.isLoading = true;
    this.errorMessage = null;

    this.beneficiarieService.getBeneficiaries().subscribe({
      next: (data) => {
        this.beneficiaries = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los beneficiarios. Intente nuevamente.';
        console.error('Error al cargar beneficiarios: ', err);
        this.isLoading = false;
      }
    })
  }

  updateBeneficiarie() {
    if (this.editForm.invalid || !this.selectedBeneficiarie) return;

    const { direccion_beneficiario, telefono_beneficiario } = this.editForm.getRawValue();

    const updateBene = {
      id_beneficiario: this.selectedBeneficiarie.id_beneficiario,
      nombres_beneficiario: this.selectedBeneficiarie.nombres_beneficiario,
      cedula_beneficiario: this.selectedBeneficiarie.cedula_beneficiario,
      direccion_beneficiario: direccion_beneficiario,
      telefono_beneficiario: telefono_beneficiario
    };

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.beneficiarieService.updateBeneficiarie(updateBene).subscribe({
      next: (response) => {
        this.notification.showSuccess('Beneficiario actualizado correctamente')
        this.loadsBeneficiares();
        this.cerrarEditModal();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al actualizar beneficiario');
        console.error('Error al actualizar beneficiario:', error);
        this.isLoading = false;
      }
    });
  }

  deleteBeneficiarie(id_beneficiario: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar este beneficiario?⚠️')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.beneficiarieService.deleteBeneficiarie(id_beneficiario).subscribe({
      next: () => {
        this.notification.showSuccess('Beneficiario eliminado correctamente')
        this.loadsBeneficiares();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al eliminar el beneficiario');
        console.error('Error al eliminar beneficiario:', error);
        this.isLoading = false;
      }
    });
  }

  searchByCedula() {
    if (!this.searchCedula.trim()) {
      this.loadsBeneficiares();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.beneficiarieService.getBeneficiarieByCedula(this.searchCedula).subscribe({
      next: (bene) => {
        if (bene) {
          this.beneficiaries = [bene];
        } else {
          /* this.beneficiaries = [this.loadsBeneficiares()]; */
          this.notification.showError('No se encontró ningún beneficiario con esa cédula');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al buscar beneficiario:', error);
        this.isLoading = false;
      }
    });
  }

  generarReporteExcel() {
    const data = this.beneficiaries.map(b => ({
      'ID': b.id_beneficiario,
      'Nombre': b.nombres_beneficiario,
      'Cédula': b.cedula_beneficiario,
      'Dirección': b.direccion_beneficiario,
      'Teléfono': b.telefono_beneficiario,
      'Fecha de Registro': new Date(b.fecha_registro).toLocaleDateString()
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    //Definir ancho para cada columna (en caracteres)
    worksheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 35 },  // Nombre
      { wch: 15 },  // Cédula
      { wch: 35 },  // Teléfono
      { wch: 15 },  // Teléfono
      { wch: 20 }   // Fecha de Registro
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Beneficiarios': worksheet },
      SheetNames: ['Beneficiarios']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Reporte_Beneficiarios.xlsx');
  }

  abrirEditModal(bene: any) {
    this.selectedBeneficiarie = bene;
    this.editForm.patchValue({
      direccion_beneficiario: bene.direccion_beneficiario,
      telefono_beneficiario: bene.telefono_beneficiario
    });
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.mostrarEditModal = false;
    this.selectedBeneficiarie = null;
  }

  clearSearch() {
    this.searchCedula = '';
    this.loadsBeneficiares(); // vuelve a cargar la lista completa
    this.errorMessage = null;
  }
}
