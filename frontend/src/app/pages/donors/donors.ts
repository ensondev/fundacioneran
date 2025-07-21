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
import { DonorsService } from '../../services/donors.service';
import { AuthStateService } from '../../shared/service/auth-state.service';

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

  private _formBuilder = inject(FormBuilder);
  private donorService = inject(DonorsService);
  private authStateService = inject(AuthStateService);

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
    // Obtener el rol desde la sesión
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
        this.successMessage = 'Teléfono del donador actualizado exitosamente';
        this.loadDonors();
        this.cerrarEditModal();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el teléfono del donador.';
        console.error('Error al actualizar donador:', error);
        this.isLoading = false;
      }
    });
  }

  searchByCedula() {
    if (!this.searchCedula.trim()) {
      this.loadDonors(); // Si está vacío, carga todos los donantes
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.donorService.getDonorByCedula(this.searchCedula).subscribe({
      next: (donor) => {
        if (donor) {
          this.donors = [donor]; // Muestra solo el donante encontrado
        } else {
          this.donors = []; // No se encontró ningún donante
          this.errorMessage = 'No se encontró ningún donante con esa cédula';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al buscar el donante. Intente nuevamente.';
        console.error('Error al buscar donante:', error);
        this.isLoading = false;
      }
    });
  }

  eliminarDonor(id_donante: number) {
    if (!confirm('¿Seguro que quieres eliminar este donador?')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.donorService.deleteDonor(id_donante).subscribe({
      next: () => {
        this.successMessage = 'Donador eliminado exitosamente';
        this.loadDonors();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar el donador.';
        console.error('Error al eliminar donador:', error);
        this.isLoading = false;
      }
    });
  }

  clearSearch() {
    this.searchCedula = '';
    this.loadDonors(); // vuelve a cargar la lista completa
    this.errorMessage = null;
  }
}
