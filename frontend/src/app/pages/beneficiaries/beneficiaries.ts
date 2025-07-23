import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { BeneficiariesService } from '../../services/beneficiaries.service';
import { AuthStateService } from '../../shared/service/auth-state.service';

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

  private _formBuilder = inject(FormBuilder);
  private beneficiarieService = inject(BeneficiariesService);
  private authStateService = inject(AuthStateService);

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
    // Obtener el rol desde la sesión
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
        this.successMessage = 'direccion y telefono del beneficiario actualizado exitosamente';
        this.loadsBeneficiares();
        this.cerrarEditModal();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la direccion y el telefono del benefciario.';
        console.error('Error al actualizar beneficiario:', error);
        this.isLoading = false;
      }
    });
  }

  deleteBeneficiarie(id_beneficiario: number) {
    if (!confirm('¿Seguro que quieres eliminar este beneficiario?')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.beneficiarieService.deleteBeneficiarie(id_beneficiario).subscribe({
      next: () => {
        this.successMessage = 'Beneficiario eliminado exitosamente';
        this.loadsBeneficiares();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar el beneficiario.';
        console.error('Error al eliminar beneficiario:', error);
        this.isLoading = false;
      }
    });
  }

  searchByCedula() {
    if (!this.searchCedula.trim()) {
      this.loadsBeneficiares(); // Si está vacío, carga todos los donantes
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.beneficiarieService.getBeneficiarieByCedula(this.searchCedula).subscribe({
      next: (bene) => {
        if (bene) {
          this.beneficiaries = [bene]; // Muestra solo el donante encontrado
        } else {
          this.beneficiaries = []; // No se encontró ningún donante
          this.errorMessage = 'No se encontró ningún beneficiario con esa cédula';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al buscar el beneficiario. Intente nuevamente.';
        console.error('Error al buscar beneficiario:', error);
        this.isLoading = false;
      }
    });
  }

  clearSearch() {
    this.searchCedula = '';
    this.loadsBeneficiares(); // vuelve a cargar la lista completa
    this.errorMessage = null;
  }
}
